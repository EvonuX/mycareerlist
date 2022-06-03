// @ts-nocheck

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import slugify from 'slugify'

const prisma = new PrismaClient()

let companies = JSON.parse(
  fs.readFileSync(`${__dirname}/data/companies.json`, 'utf-8')
)
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/data/jobs.json`, 'utf-8'))

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8')
)

companies = companies.filter(
  (v, i, a) => a.findIndex(t => t.name === v.name) === i
)

async function seed() {
  try {
    const { id: userId } = await prisma.user.findFirst({
      select: { id: true }
    })

    await prisma.payment.deleteMany()
    await prisma.review.deleteMany()
    await prisma.interview.deleteMany()
    await prisma.company.deleteMany()
    await prisma.job.deleteMany()

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
          userId: userId,
          createdAt: new Date().toISOString()
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

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i]

      if (review.reviews.length > 0) {
        const company = await prisma.company.findUnique({
          where: {
            name: review.company
          },
          select: {
            name: true,
            reviews: {
              select: {
                id: true
              }
            }
          }
        })

        if (company && company.reviews.length === 0) {
          for (const rev of review.reviews) {
            await prisma.review.create({
              data: {
                title: rev.title,
                content: rev.content,
                rating: rev.rating,
                status: rev.status,
                pros: rev.pros,
                cons: rev.cons,
                verified: Math.random() > 0.5,
                user: {
                  connect: {
                    id: userId
                  }
                },
                company: {
                  connect: {
                    name: company.name
                  }
                }
              }
            })
          }

          console.log(`Created reviews for: ${company.name}`)
        }
      }
    }

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()
