import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { formatDate } from '~/utils/helpers'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const slug = req.query.slug as string

  if (req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const job = await prisma.job.findUnique({
      where: { slug },
      select: {
        title: true,
        userId: true,
        analytics: {
          select: {
            id: true,
            date: true,
            views: {
              select: {
                referrer: true,
                userAgent: true
              }
            }
          }
        }
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Not found' })
    }

    if (job.userId !== session.userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return res.status(200).json(job)
  }

  if (req.method === 'POST') {
    try {
      await prisma.job.update({
        where: {
          slug
        },
        data: {
          analytics: {
            upsert: {
              where: {
                jobSlug: slug
              },
              create: {
                date: formatDate(new Date()),
                jobSlug: slug,
                views: {
                  create: {
                    referrer: req.body.referrer || '',
                    userAgent: req.body.userAgent || ''
                  }
                }
              },
              update: {
                views: {
                  create: {
                    referrer: req.body.referrer || '',
                    userAgent: req.body.userAgent || ''
                  }
                }
              }
            }
          }
        }
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  }
}
