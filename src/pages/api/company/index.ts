import type { Prisma } from '@prisma/client'
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
    let orderBy: Prisma.Enumerable<Prisma.CompanyOrderByWithRelationInput>

    if (req.query.sort === 'jobs') {
      orderBy = { jobs: { _count: 'desc' } }
    } else if (req.query.sort === 'reviews') {
      orderBy = { reviews: { _count: 'desc' } }
    } else {
      orderBy = { createdAt: 'desc' }
    }

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        slug: true,
        _count: true
      },
      orderBy,
      where: {
        name: {
          contains: (req.query.search as string) || undefined
        },
        jobs: {
          none: {
            expired: true,
            draft: true
          }
        }
      }
    })

    return res.status(200).json(companies)
  }

  if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const newCompany = await prisma.company.create({
      data: {
        userId: session.userId,
        ...req.body
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    const slug = slugify(newCompany.name, {
      lower: true,
      strict: true,
      trim: true,
      replacement: '-'
    })

    prisma.$use(async (params, next) => {
      if (params.model == 'Company' && params.action == 'create') {
        params.args.data.slug = slug
      }

      return await next(params)
    })

    if (!newCompany.slug) {
      const updatedNewCompany = await prisma.company.update({
        where: {
          id: newCompany.id
        },
        data: {
          slug
        },
        select: {
          id: true,
          slug: true,
          name: true
        }
      })

      await res.unstable_revalidate('/')
      return res.status(201).json(updatedNewCompany)
    }

    await res.unstable_revalidate('/')
    return res.status(201).json(newCompany)
  }

  res.status(405)
}
