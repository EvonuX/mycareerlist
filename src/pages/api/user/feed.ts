import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import prisma from '~/utils/prisma'
import { authOptions } from '../auth/[...nextauth]'

const PAGE_SIZE = 16

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  const page = Number(req.query.page) || 1

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
      take: PAGE_SIZE,
      skip: page ? page * PAGE_SIZE : 0,
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
        slug: true,
        category: true,
        type: true,
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

    const count = await prisma.job.count({
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
      }
    })

    return res.status(200).json({
      feed,
      total: count / PAGE_SIZE
    })
  }
}
