import { Alert, Center, Loader, SimpleGrid, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import type { Job } from '~/types/types'
import JobCard from './JobCard'
import Layout from './Layout'
import SEO from './SEO'

interface IProps {
  loading?: boolean
  data: {
    savedJobs: Job[]
  }
}

const UserAccountPage: FC<IProps> = ({ data, loading }) => {
  const router = useRouter()

  const [notification, setNotification] = useLocalStorage({
    key: 'show-employer-notifiction',
    defaultValue: true
  })

  useEffect(() => {
    if (router.query.noPermissions) {
      showNotification({
        title: "You don't have access to this page",
        message: 'Only employers can post new jobs. Learn more',
        color: 'yellow'
      })
    }

    if (router.query.notFound) {
      showNotification({
        title: 'This page was not found',
        message: 'Make sure to check your URL',
        color: 'yellow'
      })
    }
  }, [router.query])

  return (
    <Layout>
      <SEO title="Your account" noindex />

      {notification && (
        <Alert
          title="Become an employer"
          mb="xl"
          withCloseButton
          closeButtonLabel="Dismiss alert"
          onClose={() => setNotification(false)}
        >
          <Text>
            Employers can create companies and post jobs to expand their reach.
            Become one by reaching out to us.
          </Text>
        </Alert>
      )}

      <Title order={1} mb="md">
        Your saved jobs
      </Title>

      {loading ? (
        <Center mt="xl">
          <Loader variant="bars" />
        </Center>
      ) : (
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {!!data ? (
            data.savedJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <Text>You don&lsquo;t have any jobs saved yet.</Text>
          )}
        </SimpleGrid>
      )}
    </Layout>
  )
}

export default UserAccountPage
