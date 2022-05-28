import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import slugify from 'slugify'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (req.method === 'GET') {
    const { jobs, cursor } = await fetchJobs(req.query)

    return res.status(200).json({
      jobs,
      cursor
    })
  }

  if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const newJob = await createJob(req.body, session.userId)

      return res.status(201).json(newJob)
    } catch (err) {
      return res.status(500).json({ success: false })
    }
  }

  if (req.method === 'PUT') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!req.body.slug && !req.body.save) {
      return res.status(400).json({ message: 'Bad Request' })
    }

    let savedBy

    if (req.body.save) {
      savedBy = {
        connect: {
          id: session.userId
        }
      }
    } else {
      savedBy = {
        disconnect: {
          id: session.userId
        }
      }
    }

    try {
      await prisma.job.update({
        where: {
          slug: req.body.slug
        },
        data: {
          savedBy
        },
        select: {
          savedBy: {
            select: {
              email: true,
              id: true
            }
          }
        }
      })

      return res.status(200).json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  res.status(405).send('Method not allowed')
}

const createJob = async (body: any, userId: string) => {
  const salaryRange =
    body.salaryMin > 0 && body.salaryMax > 0
      ? `$${body.salaryMin} - $${body.salaryMax}`
      : '0'

  const newJob = await prisma.job.create({
    data: {
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      location: body.location,
      city: body.city,
      applyLink: body.applyLink,
      companyId: body.companyId,
      draft: true,
      salaryRange,
      userId
    },
    select: {
      id: true,
      title: true,
      slug: true,
      company: {
        select: {
          name: true
        }
      }
    }
  })

  const slug = slugify(`${newJob.title}-at-${newJob.company.name}`, {
    lower: true,
    strict: true,
    trim: true,
    replacement: '-'
  })

  prisma.$use(async (params, next) => {
    if (params.model === 'Job') {
      if (params.action === 'create') {
        params.action = 'update'
        params.args['data'] = { slug }
      }
    }

    return await next(params)
  })

  if (!newJob.slug) {
    const updatedNewJob = await prisma.job.update({
      where: {
        id: newJob.id
      },
      data: {
        slug
      },
      select: {
        id: true,
        title: true,
        slug: true,
        company: {
          select: {
            name: true
          }
        }
      }
    })

    return updatedNewJob
  }

  return newJob
}

const fetchJobs = async (query: any) => {
  const {
    cursor,
    title,
    location,
    category,
    type
  }: {
    cursor?: string
    title?: string
    location?: string
    category?: string
    type?: string
  } = query

  const jobs = await prisma.job.findMany({
    take: 13,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      title: {
        contains: title || undefined
      },
      location: {
        in: location?.split(',') || undefined
      },
      category: {
        in: category?.split(',') || undefined
      },
      type: {
        in: type?.split(',') || undefined
      },
      expired: {
        not: true
      },
      draft: {
        not: true
      }
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

  return {
    jobs,
    cursor: jobs.length > 0 ? jobs[jobs.length - 1].id : null
  }
}
