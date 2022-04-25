import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import slugify from 'slugify'
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
    const newCompany = await prisma.company.create({
      data: {
        userId: session.userId,
        ...req.body
      }
    })

    prisma.$use(async (params, next) => {
      if (params.model == 'Company' && params.action == 'create') {
        const slug = slugify(newCompany.name, {
          lower: true,
          strict: true,
          trim: true,
          replacement: '-'
        })

        params.args.data.slug = slug
      }

      return await next(params)
    })

    return res.status(201).json(newCompany)
  }

  res.status(200).json({ name: 'John Doe' })
}
