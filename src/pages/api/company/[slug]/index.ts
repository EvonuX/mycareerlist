import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDate } from '~/utils/helpers'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const company = await prisma.company.findUnique({
      where: {
        slug: req.query.slug as string
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logo: true,
        website: true,
        region: true,
        city: true,
        jobs: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            city: true,
            type: true,
            category: true,
            company: {
              select: {
                name: true,
                logo: true
              }
            }
          },
          where: {
            expired: {
              equals: false
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          select: {
            id: true,
            title: true,
            content: true,
            rating: true,
            pros: true,
            cons: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        interviews: {
          select: {
            id: true,
            title: true,
            hr: true,
            technical: true,
            year: true,
            difficulty: true,
            rating: true,
            position: true,
            duration: true,
            offer: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!company) {
      return res.status(404).send('Not found')
    }

    const transformedReviews = company.reviews.map(review => {
      return {
        ...review,
        createdAt: formatDate(review.createdAt)
      }
    })

    const transformedInterviews = company.interviews.map(interview => {
      return {
        ...interview,
        createdAt: formatDate(interview.createdAt)
      }
    })

    const reviews = await prisma.review.aggregate({
      where: {
        company: {
          slug: req.query.slug as string
        }
      },
      _avg: {
        rating: true
      },
      _count: true
    })

    const interviews = await prisma.interview.aggregate({
      where: {
        company: {
          slug: req.query.slug as string
        }
      },
      _avg: {
        rating: true,
        duration: true
      },
      _count: true
    })

    return res.status(200).json({
      company: {
        ...company,
        reviews: transformedReviews,
        interviews: transformedInterviews
      },
      stats: {
        reviews: {
          average: reviews._avg.rating,
          count: reviews._count
        },
        interviews: {
          averageRating: interviews._avg.rating,
          averageDuration: interviews._avg.duration,
          count: interviews._count
        }
      }
    })
  }

  res.status(405).send('Method not allowed')
}
