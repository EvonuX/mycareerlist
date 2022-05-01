import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await axios.put(
      'https://api.sendgrid.com/v3/marketing/contacts',
      {
        list_ids: ['e309e54a-438c-480f-98f7-a91975103626'],
        contacts: [
          {
            email: req.body.email
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EMAIL_SERVER_PASSWORD}`
        }
      }
    )

    res.status(200).json(data)
  } catch (err: any) {
    console.error(err.response.data)
    res.status(500).json(err)
  }
}
