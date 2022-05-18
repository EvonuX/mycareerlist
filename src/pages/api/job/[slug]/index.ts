import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const job = await prisma.job.findUnique({
      where: {
        slug: req.query.slug as string
      },
      select: {
        title: true,
        description: true,
        slug: true,
        category: true,
        type: true,
        applyLink: true,
        location: true,
        city: true,
        expired: true,
        salaryRange: true,
        savedBy: {
          select: {
            id: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
            slug: true,
            _count: true
          }
        }
      }
    })

    return res.status(200).json(job)
  }

  res.status(405)
}
