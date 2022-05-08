import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      await prisma.user.update({
        where: {
          id: session.userId
        },
        data: {
          preferences: req.body.parsedPreferences
        }
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  }

  if (req.method === 'GET') {
    const category = req.query.category
      ? { in: (req.query.category as string).split(',') }
      : undefined

    const type = req.query.type
      ? { in: (req.query.type as string).split(',') }
      : undefined

    const location = req.query.location
      ? { in: (req.query.location as string).split(',') }
      : undefined

    const feed = await prisma.job.findMany({
      where: {
        expired: {
          not: true
        },
        draft: {
          not: true
        },
        category,
        type,
        location
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        category: true,
        type: true,
        applyLink: true,
        location: true,
        city: true,
        featured: true,
        company: {
          select: {
            name: true,
            logo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json(feed)
  }
}
