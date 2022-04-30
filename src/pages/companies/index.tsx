import { SimpleGrid } from '@mantine/core'
import type { NextPage } from 'next'
import CompanyCard from '~/components/CompanyCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Company } from '~/types/types'
import prisma from '~/utils/prisma'

interface IProps {
  companies: Company[]
}

const CompanyListing: NextPage<IProps> = ({ companies }) => {
  return (
    <Layout>
      <SEO title="All companies" />

      <SimpleGrid cols={4}>
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}

export async function getStaticProps() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      slug: true,
      _count: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      jobs: {
        none: {
          expired: true
        }
      }
    }
  })

  return {
    props: {
      companies
    }
  }
}

export default CompanyListing
