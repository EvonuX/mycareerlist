import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (req.method === 'GET') {
    const reviews = await prisma.review.findMany({
      where: {
        companyId: req.query.companyId as string
      },
      select: {
        id: true,
        title: true,
        content: true,
        rating: true,
        pros: true,
        cons: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json(reviews)
  }

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const newReview = await prisma.review.create({
      data: {
        userId: session.userId,
        ...req.body
      }
    })

    return res.status(201).json(newReview)
  }

  res.status(200).json({ name: 'John Doe' })
}
