import type { NextApiRequest, NextApiResponse } from 'next'
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
    await emailClient.sendMultiple({
      to: ['djordje42@gmail.com', 'djolowow2@gmail.com'],
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
