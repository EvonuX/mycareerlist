// @ts-nocheck

import { Table, Title, useMantineColorScheme } from '@mantine/core'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Chart } from 'react-charts'
import { useQuery } from 'react-query'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Job } from '~/types/types'
import { fetcher, formatDate } from '~/utils/helpers'

const AnalyticsPage: NextPage = () => {
  const router = useRouter()
  const slug = router.query.slug

  const { colorScheme } = useMantineColorScheme()

  const { data: job, error } = useQuery<Job, Error>(['analytics', slug], () =>
    fetcher(`/api/job/${slug}/analytics`)
  )

  const primaryAxis = useMemo(
    () => ({
      getValue: datum => datum.date
    }),
    []
  )

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: datum => datum.visitorCount,
        elementType: 'line'
      }
    ],
    []
  )

  if (error) {
    router.replace('/')
  }

  if (!job) {
    return null
  }

  const analytics = job.analytics.map(analytic => {
    return (
      <tr key={analytic.id}>
        <td>{formatDate(analytic.date)}</td>
        <td>{analytic.visitorCount}</td>
      </tr>
    )
  })

  const data = [
    {
      label: 'Visitors',
      data: job.analytics.map(analytic => ({
        date: formatDate(analytic.date),
        visitorCount: analytic.visitorCount
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
          secondaryAxes,
          dark: colorScheme === 'dark'
        }}
      />
    </Layout>
  )
}

export default AnalyticsPage
