import {
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import UserAccountPage from '~/components/UserAccountPage'
import type { Company, Job } from '~/types/types'
import { fetcher } from '~/utils/helpers'

interface QueryProps {
  savedJobs: Job[]
  companies: Company[]
}

const AccountPage = () => {
  const router = useRouter()

  const { data: user } = useSession({
    required: true,
    onUnauthenticated() {
      return router.push('/')
    }
  })

  const { data, isLoading } = useQuery<QueryProps, Error>('accountPage', () =>
    fetcher('/api/user')
  )

  if (!user) {
    return <Title>No user, please try logging in again</Title>
  }

  if (user.userRole === 'USER') {
    // @ts-ignore
    return <UserAccountPage data={data} />
  }

  return (
    <Layout>
      <SEO title="Your account" noindex />

      <Title order={1} mb="xl">
        Your account
      </Title>

      <Group grow mb="lg">
        <Link href="/jobs/new" passHref>
          <Button>Create a job</Button>
        </Link>

        <Link href="/companies/new" passHref>
          <Button>Create a company</Button>
        </Link>
      </Group>

      <Title order={2} mb="md">
        Company and job overview
      </Title>

      {isLoading ? (
        <Center mt="xl">
          <Loader variant="bars" />
        </Center>
      ) : (
        <Stack>
          {data?.companies.map(company => {
            return (
              <Paper p="sm" shadow="sm" key={company.slug}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb="sm">
                  <Box
                    mr="sm"
                    sx={{
                      height: 40,
                      width: 40,
                      position: 'relative',
                      borderRadius: 5,
                      overflow: 'hidden',
                      backgroundColor: 'white'
                    }}
                  >
                    <Image
                      src={company.logo as string}
                      alt={company.name}
                      width={40}
                      height={40}
                    />
                  </Box>

                  <Link href={`/companies/${company.slug}`} passHref>
                    <Anchor sx={{ color: 'inherit' }}>
                      <Title order={3} sx={{ fontSize: 18 }}>
                        {company.name}
                      </Title>
                    </Anchor>
                  </Link>
                </Box>

                {company.jobs.length ? (
                  company.jobs.map(job => {
                    return (
                      <Stack key={job.slug}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'revert',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box>
                            {!job.expired || !job.draft ? (
                              <Link href={`/jobs/${job.slug}`} passHref>
                                <Anchor sx={{ color: 'inherit' }}>
                                  <Title
                                    order={4}
                                    sx={{ fontWeight: 'normal' }}
                                  >
                                    {job.title}
                                  </Title>
                                </Anchor>
                              </Link>
                            ) : (
                              <Title order={4} sx={{ fontWeight: 'normal' }}>
                                {job.title}
                              </Title>
                            )}
                          </Box>

                          <Group>
                            {job.expired && (
                              <Badge
                                size="sm"
                                radius="xs"
                                variant="outline"
                                color="red"
                              >
                                Expired
                              </Badge>
                            )}
                            {job.draft && (
                              <Badge
                                size="sm"
                                radius="xs"
                                variant="outline"
                                color="yellow"
                              >
                                Draft
                              </Badge>
                            )}
                            {job.featured && (
                              <Badge
                                size="sm"
                                radius="xs"
                                variant="outline"
                                color="green"
                              >
                                Featured
                              </Badge>
                            )}
                          </Group>
                        </Box>
                      </Stack>
                    )
                  })
                ) : (
                  <Text>This company does not have any jobs yet.</Text>
                )}
              </Paper>
            )
          })}
        </Stack>
      )}
    </Layout>
  )
}

export default AccountPage
