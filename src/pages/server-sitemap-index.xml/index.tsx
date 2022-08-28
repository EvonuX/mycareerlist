import type { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import prisma from '~/utils/prisma'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const jobQuery = await prisma.job.findMany({
    select: {
      updatedAt: true,
      slug: true
    },
    where: {
      expired: {
        not: true
      },
      draft: {
        not: true
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const companyQuery = await prisma.company.findMany({
    select: {
      updatedAt: true,
      slug: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      jobs: {
        none: {
          expired: true,
          draft: true
        }
      }
    }
  })

  const jobs = jobQuery.map(job => {
    return {
      url: `https://mycareerlist.com/jobs/${job.slug}`,
      updatedAt: job.updatedAt.toISOString()
    }
  })
  const companies = companyQuery.map(company => {
    return {
      url: `https://mycareerlist.com/companies/${company.slug}`,
      updatedAt: company.updatedAt.toISOString()
    }
  })

  const fields: ISitemapField[] = []

  for (const job of jobs) {
    fields.push({
      loc: job.url,
      lastmod: job.updatedAt,
      changefreq: 'monthly',
      priority: 0.7
    })
  }

  for (const company of companies) {
    fields.push({
      loc: company.url,
      lastmod: company.updatedAt,
      changefreq: 'daily',
      priority: 0.7
    })
  }

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {}
