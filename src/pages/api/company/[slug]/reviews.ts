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
    const newReview = await prisma.review.create({
      data: {
        createdAt: new Date().toISOString(),
        userId: session.userId,
        ...req.body
      }
    })

    await res.unstable_revalidate('/')
    await res.unstable_revalidate(`/companies/${req.query.slug}`)
    return res.status(201).json(newReview)
  }

  res.status(405).send('Method not allowed')
}
