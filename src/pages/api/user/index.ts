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

  const userData = await prisma.user.findUnique({
    where: {
      id: session.userId
    },
    select: {
      companies: {
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

  res.status(200).json(userData)
}
