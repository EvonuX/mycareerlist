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
  Text,
  Grid
} from '@mantine/core'
import { NextLink } from '@mantine/next'
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
  const fetchEmployerData = () => fetcher('/api/user')

  const { data, isLoading } = useQuery<QueryProps, Error>(
    'accountPage',
    fetchEmployerData
  )

  return (
    <Layout>
      <SEO title="Your account" noindex />

      <Grid columns={12}>
        <Grid.Col md={3} span={12} sx={{ position: 'relative' }}>
          <Box sx={{ position: 'sticky', top: 15 }}>
            <Title order={1} mb="xl">
              Your account
            </Title>

            <Group grow direction="column">
              <Button component={NextLink} href="/jobs/new">
                Create a job
              </Button>

              <Button component={NextLink} href="/companies/new">
                Create a company
              </Button>
            </Group>
          </Box>
        </Grid.Col>

        <Grid.Col md={9} span={12}>
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
                          <Stack
                            key={job.slug}
                            sx={{
                              marginBottom: 15,

                              '&:last-child': {
                                marginBottom: 0
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',

                                '@media (max-width: 768px)': {
                                  alignItems: 'flex-start',
                                  flexDirection: 'column'
                                }
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
                                  <Title
                                    order={4}
                                    sx={{ fontWeight: 'normal' }}
                                  >
                                    {job.title}
                                  </Title>
                                )}
                              </Box>

                              <Group
                                sx={{
                                  '@media (max-width: 768px)': { marginTop: 10 }
                                }}
                              >
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

                                <Button
                                  component={NextLink}
                                  href={`/jobs/${job.slug}/analytics`}
                                  size="xs"
                                  variant="subtle"
                                >
                                  Insights
                                </Button>
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
        </Grid.Col>
      </Grid>
    </Layout>
  )
}

export default EmployerAccountPage
