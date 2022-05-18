import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import prisma from '~/utils/prisma'
import emailClient from '~/utils/sendgrid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
            logo: true,
            slug: true
          }
        }
      },
      where: {
        featured: {
          not: false
        },
        expired: {
          not: true
        },
        draft: {
          not: true
        },
        updatedAt: {
          gte: new Date(
            new Date().getTime() - 6 * 24 * 60 * 60 * 1000
          ).toISOString()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

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
      templateId: 'd-6a03531f1b1e4e49afee797ff6ca3d7b',
      dynamicTemplateData: {
        jobs
      }
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    // @ts-ignore
    res.status(500).json({ error: error.message || 'An issue occured' })
  }
}
