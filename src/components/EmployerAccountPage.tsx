import {
  Title,
  Group,
  Button,
  Center,
  Loader,
  Stack,
  Paper,
  Box,
  Anchor,
  Badge,
  Text
} from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { Company, Job } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import Layout from './Layout'
import SEO from './SEO'

interface QueryProps {
  savedJobs: Job[]
  companies: Company[]
}

const EmployerAccountPage = () => {
  const { data, isLoading } = useQuery<QueryProps, Error>('accountPage', () =>
    fetcher('/api/user')
  )

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
                      backgroundColor: '#fff'
                    }}
                  >
                    <Image
                      src={company.logo as string}
                      alt={company.name}
                      width={40}
                      height={40}
                      objectFit="contain"
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

                            <Link href={`/jobs/${job.slug}/analytics`} passHref>
                              <Button size="xs" variant="subtle">
                                Insights
                              </Button>
                            </Link>
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

export default EmployerAccountPage
