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

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (session.userRole === 'USER') {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId
      },
      select: {
        preferences: true,
        savedJobs: {
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
          where: {
            expired: {
              not: true
            },
            draft: {
              not: true
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return res.status(200).json(user)
  }

  const page = Number(req.query.page) || 1
  const search = req.query.search as string

  const companies = await prisma.user.findUnique({
    where: {
      id: session.userId
    },
    select: {
      companies: {
        where: {
          name: {
            contains: search || undefined
          }
        },
        take: search ? undefined : PAGE_SIZE,
        skip: !search && page ? page * PAGE_SIZE : 0,
        select: {
          name: true,
          logo: true,
          slug: true,
          _count: {
            select: {
              jobs: true,
              reviews: true
            }
          },
          jobs: {
            select: {
              title: true,
              slug: true,
              featured: true,
              draft: true,
              expired: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  const count = await prisma.company.count({
    where: {
      userId: session.userId,
      OR: [
        {
          name: {
            contains: search || undefined
          }
        },
        {
          jobs: {
            some: {
              title: {
                contains: search || undefined
              }
            }
          }
        }
      ]
    }
  })

  res.status(200).json({
    user: companies,
    total: (count / PAGE_SIZE).toFixed()
  })
}
