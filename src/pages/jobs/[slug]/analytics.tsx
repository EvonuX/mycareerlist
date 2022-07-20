import {
  Center,
  Loader,
  Table,
  Title,
  useMantineColorScheme
} from '@mantine/core'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Chart } from 'react-charts'
import { useQuery } from '@tanstack/react-query'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Job } from '~/types/types'
import { fetcher, formatDate } from '~/utils/helpers'

interface QueryProps {
  job: Job
  title: string
  updatedAt: string
  analytics: {
    date: string
    visitors: number
  }[]
}

const AnalyticsPage: NextPage = () => {
  const router = useRouter()
  const slug = router.query.slug

  const { colorScheme } = useMantineColorScheme()

  const { data: job, error } = useQuery<QueryProps, Error>(
    ['analytics', slug],
    () => fetcher(`/api/job/${slug}/analytics`),
    {
      enabled: slug !== undefined
    }
  )

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum: { date: string }) => datum.date
    }),
    []
  )

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum: { visitors: number }) => datum.visitors,
        elementType: 'line'
      }
    ],
    []
  )

  if (error) {
    router.replace('/')
  }

  if (!job) {
    return (
      <Layout>
        <Center>
          <Loader />
        </Center>
      </Layout>
    )
  }

  const analytics = job.analytics.map(analytic => {
    return (
      <tr key={analytic.date}>
        <td>{formatDate(analytic.date)}</td>
        <td>{analytic.visitors}</td>
      </tr>
    )
  })

  const data = [
    {
      label: 'Visitors',
      data: job.analytics.map(analytic => ({
        date: formatDate(analytic.date),
        visitors: analytic.visitors
      }))
    }
  ]

  return (
    <Layout>
      <SEO title={`Analytics for ${job.title}`} noindex />

      <Title order={1} mb="lg">
        Summary for {job.title}
      </Title>

      <Table striped mb="xl">
        <thead>
          <tr>
            <th>Date</th>
            <th>Visitor Count</th>
          </tr>
        </thead>

        <tbody>{analytics}</tbody>
      </Table>

      <Chart
        options={{
          data,
          primaryAxis,
          // @ts-ignore
          secondaryAxes,
          dark: colorScheme === 'dark'
        }}
      />
    </Layout>
  )
}

export default AnalyticsPage
