import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { formatDate } from '~/utils/helpers'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (req.method === 'GET') {
    const interviews = await prisma.interview.findMany({
      where: {
        companyId: req.query.companyId as string
      },
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
    })

    const transformedInterviews = interviews.map(interview => {
      return {
        ...interview,
        createdAt: formatDate(interview.createdAt)
      }
    })

    return res.status(200).json(transformedInterviews)
  }

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const newInterview = await prisma.interview.create({
      data: {
        ...req.body,
        userId: session.userId,
        duration: Number(req.body.duration)
      }
    })

    return res.status(201).json(newInterview)
  }

  res.status(405).send('Method not allowed')
}
