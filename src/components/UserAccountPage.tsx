import {
  Alert,
  Button,
  Center,
  Loader,
  SimpleGrid,
  Text,
  Title
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import type { Job } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import Layout from './Layout'
import SEO from './SEO'
import qs from 'query-string'
import axios from 'axios'

const JobCard = dynamic(() => import('./JobCard'), {
  ssr: false
})

const JobFeedForm = dynamic(() => import('./JobFeedForm'), {
  ssr: false
})

interface UserQuery {
  savedJobs: Job[]
  preferences: string
}

const UserAccountPage: FC = () => {
  const [preferences, setPreferences] = useState('')
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data, isFetching, isRefetching } = useQuery<UserQuery>(
    'accountPage',
    () => fetcher('/api/user'),
    {
      onSuccess: data => {
        setPreferences(data.preferences)
      }
    }
  )

  const parsePreferences = (preferences: string) =>
    qs.parse(preferences, {
      arrayFormat: 'comma',
      arrayFormatSeparator: ','
    })

  const { data: jobFeed } = useQuery<Job[]>(
    ['jobFeed', preferences],
    () => fetcher(`/api/user/feed?${preferences}`),
    {
      enabled: preferences !== ''
    }
  )

  const [notification, setNotification] = useLocalStorage({
    key: 'mcl-show-employer-notifiction',
    defaultValue: true
  })

  const handleJobCustomization = async (values: any) => {
    setLoading(true)

    try {
      const parsedPreferences = qs.stringify(values, {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: 'comma',
        arrayFormatSeparator: ','
      })

      await axios.post('/api/user/feed', { parsedPreferences })

      setPreferences(parsedPreferences)
      setOpened(false)

      showNotification({
        title: 'Preferences updated',
        message: "You'll now receive tailored jobs on your account page",
        color: 'green'
      })
    } catch (err) {
      console.error(err)

      showNotification({
        title: 'An error occured',
        message: 'Please try refreshing the page or try again alter',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

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

      <Title order={2} mb="md">
        Your saved jobs
      </Title>

      {isFetching || isRefetching ? (
        <Center>
          <Loader variant="bars" />
        </Center>
      ) : data?.savedJobs.length ? (
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]} mb="xl">
          {data.savedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </SimpleGrid>
      ) : (
        <Text mb="xl">
          You don&lsquo;t have any jobs saved yet. Start by visiting a job page
          and clicking the &quot;Save job&quot; button.
        </Text>
      )}

      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]} mb="lg">
        <Title order={2}>Your job feed</Title>

        <Button
          variant="light"
          size="xs"
          onClick={() => setOpened(true)}
          sx={{
            width: 'fit-content',
            alignSelf: 'center',
            justifySelf: 'flex-end',

            '@media (max-width: 768px)': {
              justifySelf: 'flex-start'
            }
          }}
        >
          {preferences ? 'Customize' : 'Start customizing'}
        </Button>
      </SimpleGrid>

      {isFetching || isRefetching ? (
        <Center>
          <Loader variant="bars" />
        </Center>
      ) : jobFeed ? (
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]} mb="xl">
          {jobFeed.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>
          Set preferences to start seeing only jobs that interest you.
        </Text>
      )}

      <JobFeedForm
        loading={loading}
        opened={opened}
        setOpened={setOpened}
        onSubmit={handleJobCustomization}
        preferences={parsePreferences(preferences) as any}
      />
    </Layout>
  )
}

export default UserAccountPage
