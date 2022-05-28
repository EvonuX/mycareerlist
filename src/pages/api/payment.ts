import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getCategory, getLocation, getType } from '~/utils/helpers'
import prisma from '~/utils/prisma'
import twitterClient from '~/utils/twitter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    if (req.body.status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          orderID: req.body.id,
          userId: session.userId,
          amount: req.body.total
        }
      })

      const job = await prisma.job.update({
        where: {
          id: req.body.job.id
        },
        data: {
          draft: false,
          featured: req.body.featured
        },
        select: {
          title: true,
          featured: true,
          slug: true,
          type: true,
          category: true,
          location: true,
          city: true,
          company: {
            select: {
              name: true,
              logo: true,
              slug: true
            }
          }
        }
      })

      if (job.featured && process.env.NODE_ENV === 'production') {
        await notifySlack(job)
        await twitterClient.v2.tweet(
          `${job.title} at ${job.company.name} ${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${job.slug}`
        )
      }

      await res.unstable_revalidate('/')
      await res.unstable_revalidate(`/companies/${job.company.slug}`)

      return res.status(200).json({ success: true })
    }

    res.status(400).json({ success: false })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false })
  }
}

const notifySlack = async (job: any) => {
  const titleText = `*${job.title}* \n at ${
    job.company.name
  }\n\nCategory: ${getCategory(job.category)}\nType: ${getType(
    job.type
  )}\nLocation: ${getLocation(job.city, job.location)}`

  const body = {
    channel: 'new-jobs',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: titleText.trim()
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Job Details'
            },
            value: 'view_job',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${job.slug}`
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Company Profile'
            },
            value: 'view_company',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/companies/${job.company.slug}`
          }
        ]
      }
    ]
  }

  try {
    await axios.post('https://slack.com/api/chat.postMessage', body, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_APP_TOKEN}`
      }
    })
  } catch (err) {
    console.error(err)
  }
}
