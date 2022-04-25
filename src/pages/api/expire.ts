import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let date = new Date()
  date.setDate(date.getDate() - 2)

  const dateString = date.toISOString().split('T')[0]
  const expDate = new Date(dateString)

  const expiredJobs = await prisma.job.updateMany({
    where: {
      createdAt: {
        lte: expDate
      },
      expired: false
    },
    data: {
      expired: true
    }
  })

  res.status(200).json(expiredJobs)
}
