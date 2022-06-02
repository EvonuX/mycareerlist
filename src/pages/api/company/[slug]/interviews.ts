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
    const newInterview = await prisma.interview.create({
      data: {
        ...req.body,
        createdAt: new Date().toISOString(),
        userId: session.userId,
        difficulty: Number(req.body.difficulty),
        duration: Number(req.body.duration)
      }
    })

    await res.unstable_revalidate(`/companies/${req.query.slug}`)
    return res.status(201).json(newInterview)
  }

  res.status(405).send('Method not allowed')
}
