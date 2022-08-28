import { formidable } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'
import os from 'os'
import cloudinary from '~/utils/cloudinary'
import prisma from '~/utils/prisma'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // @ts-ignore
    const { files, companyId } = await new Promise((resolve, reject) => {
      const form = formidable({
        uploadDir: os.tmpdir(),
        keepExtensions: true
      })

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ files, companyId: fields.companyId })
      })
    })

    const image = await cloudinary.v2.uploader.upload(files.logo.filepath, {
      folder: `mycareerlist/${companyId}`,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true
    })

    await prisma.company.update({
      where: {
        id: companyId
      },
      data: {
        logo: image.secure_url
      }
    })

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}
