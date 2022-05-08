import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '~/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const slug = req.query.slug as string

  if (req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const job = await prisma.job.findUnique({
      where: { slug },
      select: {
        title: true,
        userId: true,
        updatedAt: true
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Not found' })
    }

    if (job.userId !== session.userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const jobDate = job.updatedAt.toISOString().split('T')[0]
    const currentDate = new Date().toISOString().split('T')[0]

    const config = {
      method: 'GET',
      url: `https://plausible.io/api/v1/stats/timeseries?site_id=mycareerlist.vercel.app&period=custom&date=${jobDate},${currentDate}&interval=date&filters=event:page==/jobs/${slug}`,
      headers: {
        Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`
      }
    }

    const { data } = await axios(config)

    return res.status(200).json({ ...job, analytics: data.results })
  }
}
