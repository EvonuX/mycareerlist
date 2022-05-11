import {
  Box,
  Button,
  Drawer,
  Grid,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { useIntersection } from '@mantine/hooks'
import type { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import qs from 'query-string'
import React, { useEffect, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import JobCard from '~/components/JobCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Job } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import prisma from '~/utils/prisma'

const JobFilters = dynamic(() => import('~/components/JobFilters'), {
  ssr: false,
  loading: () => <Skeleton height={310} />
})

interface IProps {
  jobs: Job[]
}

const JobListing: NextPage<IProps> = ({ jobs }) => {
  const router = useRouter()

  const initialQuery = qs.stringify(router.query, {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'comma',
    arrayFormatSeparator: ','
  })

  const [query, setQuery] = useState(initialQuery || '')
  const [opened, setOpened] = useState(false)

  const [ref, observer] = useIntersection({
    rootMargin: '200px'
  })

  const fetchJobs = async ({ pageParam }: { pageParam?: string }) => {
    return pageParam
      ? await fetcher(`/api/job?cursor=${pageParam}&${query}`)
      : await fetcher(`/api/job?${query}`)
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useInfiniteQuery(['jobs', query], fetchJobs, {
      getNextPageParam: lastPage => lastPage.cursor,
      initialData: {
        pageParams: [undefined],
        pages: [jobs]
      }
    })

  useEffect(() => {
    if (observer?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observer])

  return (
    <Layout>
      <SEO title="All jobs" />

      <Title order={1} mb="md">
        All jobs
      </Title>

      <Grid>
        <Grid.Col
          md={3}
          sx={{
            '@media (max-width: 768px)': {
              display: 'none'
            }
          }}
        >
          <Paper
            shadow="xs"
            p="md"
            sx={{
              position: 'sticky',
              top: 20
            }}
          >
            <JobFilters setQuery={setQuery} />
          </Paper>
        </Grid.Col>

        <Grid.Col md={9}>
          <Stack>
            {data &&
              data.pages.map(page =>
                page.jobs
                  ? page.jobs.map((job: Job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  : null
              )}
          </Stack>

          <Stack align="center" my={20} ref={ref}>
            <Loader
              variant="dots"
              sx={{
                display: isFetchingNextPage || isRefetching ? 'block' : 'none'
              }}
            />
            {(isFetchingNextPage || isRefetching) && (
              <Text>Loading jobs...</Text>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Filter jobs"
        padding="md"
        size="xl"
      >
        <JobFilters setQuery={setQuery} />
      </Drawer>

      <Button
        onClick={() => setOpened(true)}
        leftIcon={
          <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            sx={{ width: 15, height: 15 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </Box>
        }
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          '@media (min-width: 768px)': { display: 'none' }
        }}
      >
        Filter jobs
      </Button>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const {
    title,
    location,
    category,
    type
  }: {
    title?: string
    location?: string
    category?: string
    type?: string
  } = query

  const jobs = await prisma.job.findMany({
    take: 10,
    where: {
      title: {
        contains: title || undefined
      },
      location: {
        in: location?.split(',') || undefined
      },
      category: {
        in: category?.split(',') || undefined
      },
      type: {
        in: type?.split(',') || undefined
      },
      expired: {
        not: true
      },
      draft: {
        not: true
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      category: true,
      type: true,
      applyLink: true,
      location: true,
      city: true,
      featured: true,
      company: {
        select: {
          name: true,
          logo: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    props: {
      jobs
    }
  }
}

export default JobListing
