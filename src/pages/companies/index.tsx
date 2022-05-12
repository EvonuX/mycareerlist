import { Box, Select, SimpleGrid, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import type { NextPage } from 'next'
import qs from 'query-string'
import { ChangeEvent, useState } from 'react'
import { useQuery } from 'react-query'
import CompanyCard from '~/components/CompanyCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Company } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import prisma from '~/utils/prisma'

interface IProps {
  initialData: Company[]
}

const CompanyListing: NextPage<IProps> = ({ initialData }) => {
  const [query, setQuery] = useState({ sort: '', search: '' })
  const [debounced] = useDebouncedValue(query.search, 350)

  const parsedQuery = qs.stringify(
    { sort: query.sort, search: debounced },
    {
      skipNull: true,
      skipEmptyString: true
    }
  )

  const fetchCompanies = () => fetcher(`/api/company?${parsedQuery}`)

  const { data } = useQuery<Company[], Error>(
    ['companyListing', parsedQuery],
    fetchCompanies,
    {
      initialData
    }
  )

  return (
    <Layout>
      <SEO title="All companies" />

      <Box mb="lg">
        <Title order={1} mb="xs">
          Company listing
        </Title>

        {data && <Text size="sm">Showing {data.length} companies</Text>}
      </Box>

      <SimpleGrid cols={2} mb="lg">
        <TextInput
          label="Search company by name"
          value={query.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery({ ...query, search: e.target.value })
          }
        />

        <Select
          label="Sort companies by"
          data={[
            { value: '', label: 'Join date' },
            { value: 'jobs', label: 'Active jobs' },
            { value: 'reviews', label: 'Review count' }
          ]}
          value={query.sort}
          onChange={(value: string) => setQuery({ ...query, sort: value })}
        />
      </SimpleGrid>

      {data ? (
        <>
          <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: 768, cols: 2 }]}
            mb="md"
          >
            {data.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Text>No companies to show</Text>
      )}
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
          expired: true,
          draft: true
        }
      }
    }
  })

  return {
    props: {
      initialData: companies
    }
  }
}

export default CompanyListing
