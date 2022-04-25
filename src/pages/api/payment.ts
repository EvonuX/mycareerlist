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

  try {
    if (req.body.status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          orderID: req.body.id,
          userId: session.userId,
          amount: req.body.total
        }
      })

      await prisma.job.update({
        where: {
          id: req.body.job.id
        },
        data: {
          draft: false,
          featured: req.body.featured
        }
      })

      return res.status(200).json({ success: true })
    }

    res.status(400).json({ success: false })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false })
  }
}
