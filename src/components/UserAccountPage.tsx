import { SimpleGrid, Text, Title } from '@mantine/core'
import type { FC } from 'react'
import type { Job } from '~/types/types'
import JobCard from './JobCard'
import Layout from './Layout'
import SEO from './SEO'

interface IProps {
  data: {
    savedJobs: Job[]
  }
}

const UserAccountPage: FC<IProps> = ({ data }) => {
  return (
    <Layout>
      <SEO title="Your account" noindex />

      <Title order={1} mb="md">
        Your saved jobs
      </Title>

      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
        {!!data ? (
          data.savedJobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          <Text>You don&lsquo;t have any jobs saved yet.</Text>
        )}
      </SimpleGrid>
    </Layout>
  )
}

export default UserAccountPage
