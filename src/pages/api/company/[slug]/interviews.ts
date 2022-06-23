import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import prisma from '~/utils/prisma'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const newInterview = await prisma.interview.create({
      data: {
        ...req.body,
        createdAt: new Date().toISOString(),
        userId: session.userId,
        difficulty: Number(req.body.difficulty),
        duration: Number(req.body.duration)
      }
    })

    return res.status(201).json(newInterview)
  }

  res.status(405).send('Method not allowed')
}
