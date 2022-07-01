import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let date = new Date()
  date.setMonth(date.getMonth() - 1)

  const expiredJobs = await prisma.job.updateMany({
    where: {
      expired: false,
      createdAt: {
        lte: date.toISOString()
      }
    },
    data: {
      expired: true
    }
  })

  // await res.revalidate('/')
  res.status(200).json(expiredJobs)
}
