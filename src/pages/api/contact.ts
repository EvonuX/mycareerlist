import type { NextApiRequest, NextApiResponse } from 'next'
import emailClient from '~/utils/sendgrid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, subject, body } = req.body

  try {
    await emailClient.send({
      to: 'djordje42@gmail.com',
      from: email,
      subject: `MCL - ${subject}`,
      text: body,
      html: `<p>${body}</p>`
    })

    res.status(200).json({ success: true })
  } catch (err: any) {
    console.error(err.response.body)
    res.status(500).json({ success: false, error: err.response.body })
  }
}
