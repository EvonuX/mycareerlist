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

  const slug = req.query.slug as string

  const job = await prisma.job.findUnique({
    where: { slug },
    select: {
      title: true,
      analytics: true,
      userId: true
    }
  })

  if (!job) {
    return res.status(404).json({ message: 'Not found' })
  }

  if (job.userId !== session.userId) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  res.status(200).json(job)
}
