import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await res.unstable_revalidate('/')
    await res.unstable_revalidate('/jobs/*')
    await res.unstable_revalidate('/companies')
    await res.unstable_revalidate('/companies/*')

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false })
  }
}
