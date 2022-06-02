import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/utils/prisma'
import slugify from 'slugify'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { companies, jobs } = req.body

    if (!companies || !jobs) {
      return res.status(401).json({ success: false })
    }

    try {
      // @ts-ignore
      const { id: userId } = await prisma.user.findFirst({
        where: {
          email: 'djordje.stevanovic@wemakewebsites.com'
        },
        select: { id: true }
      })

      for (let i = 0; i < companies.length; i++) {
        const company = companies[i]

        const slug = slugify(company.name, {
          lower: true,
          strict: true,
          trim: true,
          replacement: '-'
        })

        await prisma.company.upsert({
          where: {
            name: company.name
          },
          create: {
            name: company.name,
            description: company.description.trim(),
            website: company.website,
            region: 'remote',
            slug: slug,
            city: company.location,
            logo: company.logo,
            userId: userId
          },
          update: {
            name: company.name
          }
        })

        console.log(`Created company: ${company.name}`)
      }

      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i]

        const slug = slugify(`${job.title}-at-${job.cName}`, {
          lower: true,
          strict: true,
          trim: true,
          replacement: '-'
        })

        await prisma.job.create({
          data: {
            title: job.title,
            description: job.description.trim(),
            slug: slug,
            type: job.type.toLowerCase(),
            category: job.category,
            location: 'remote',
            city: job.location,
            applyLink: job.apply,
            userId: userId,
            featured: Math.random() > 0.5,
            draft: false,
            createdAt: new Date().toISOString(),
            company: {
              connect: {
                name: job.cName
              }
            }
          }
        })

        console.log(`Create job: ${job.title} at ${job.cName}`)
      }

      await res.unstable_revalidate('/')
      await res.unstable_revalidate('/jobs')
      await res.unstable_revalidate('/jobs/*')
      await res.unstable_revalidate('/companies')
      await res.unstable_revalidate('/companies/*')

      return res.status(200).json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false })
    }
  }

  res.status(405).send('Method not allowed')
}
