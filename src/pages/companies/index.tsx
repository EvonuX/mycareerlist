import {
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useDebouncedValue, useIntersection } from '@mantine/hooks'
import type { GetServerSideProps, NextPage } from 'next'
import qs from 'query-string'
import { ChangeEvent, useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import CompanyCard from '~/components/CompanyCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Company } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import prisma from '~/utils/prisma'

interface IProps {
  companies: Company[]
  cursor: string | undefined
}

const CompanyListing: NextPage<IProps> = ({ companies, cursor }) => {
  const [query, setQuery] = useState({ sort: '', search: '' })
  const [debounced] = useDebouncedValue(query.search, 350)

  const parsedQuery = qs.stringify(
    { sort: query.sort, search: debounced },
    {
      skipNull: true,
      skipEmptyString: true
    }
  )

  const { ref, entry } = useIntersection({
    threshold: 1,
    rootMargin: '300px'
  })

  const fetchCompanies = async ({ pageParam }: { pageParam?: string }) => {
    return pageParam
      ? await fetcher(`/api/company?cursor=${pageParam}&${parsedQuery}`)
      : await fetcher(`/api/company?${parsedQuery}`)
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useInfiniteQuery(['companyListing', parsedQuery], fetchCompanies, {
      getNextPageParam: lastPage => lastPage.cursor ?? undefined,
      keepPreviousData: true,
      initialData: {
        pages: [{ companies, cursor }],
        pageParams: [null]
      }
    })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry])

  return (
    <Layout>
      <SEO title="All companies" />

      <Title order={1} mb="lg">
        Company listing
      </Title>

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

      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 768, cols: 2 }]} mb="md">
        {data &&
          data.pages.map(page =>
            page.companies
              ? page.companies.map((company: Company) => (
                  <CompanyCard key={company.id} company={company} />
                ))
              : null
          )}
      </SimpleGrid>

      <Stack align="center" my={20} ref={ref}>
        <Loader
          variant="dots"
          sx={{
            display: isFetchingNextPage || isRefetching ? 'block' : 'none'
          }}
        />
        {(isFetchingNextPage || isRefetching) && (
          <Text>Loading companies...</Text>
        )}
      </Stack>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const companies = await prisma.company.findMany({
    take: 32,
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

  res.setHeader('Cache-Control', `s-maxage=100000, stale-while-revalidate`)

  return {
    props: {
      companies,
      cursor: companies.length > 0 ? companies[companies.length - 1].id : null
    }
  }
}

export default CompanyListing
