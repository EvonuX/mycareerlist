import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import prisma from '~/utils/prisma'
import emailClient from '~/utils/sendgrid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jobs = await prisma.job.findMany({
    take: 10,
    select: {
      title: true,
      slug: true,
      category: true,
      type: true,
      location: true,
      city: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          logo: true
        }
      }
    },
    where: {
      expired: {
        not: true
      },
      draft: {
        not: true
      },
      createdAt: {
        gte: new Date(
          new Date().getTime() - 6 * 24 * 60 * 60 * 1000
        ).toISOString()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  try {
    const { data } = await axios.post(
      'https://api.sendgrid.com/v3/marketing/contacts/search',
      {
        query: "CONTAINS(list_ids, 'e309e54a-438c-480f-98f7-a91975103626')"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EMAIL_SERVER_PASSWORD}`
        }
      }
    )

    const users = data.result.map((user: any) => user.email)

    await emailClient.sendMultiple({
      to: users,
      from: 'noreply@mcl.com',
      templateId: 'd-9e046bd1558545f0aaecb8e41a5feee5',
      dynamicTemplateData: {
        jobs
      }
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}
