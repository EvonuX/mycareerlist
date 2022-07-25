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
  Grid,
  Pagination,
  TextInput
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Company } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import Layout from './Layout'
import SEO from './SEO'

interface QueryProps {
  user: {
    companies: Company[]
  }
  total: number
}

const EmployerAccountPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 350)

  const fetchEmployerData = (page: number) =>
    fetcher(`/api/user?page=${page}&search=${debounced}`)

  const { data, isLoading } = useQuery<QueryProps, Error>(
    ['accountPage', page, debounced],
    () => fetchEmployerData(page)
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

            <Stack>
              <Button fullWidth component={NextLink} href="/jobs/new">
                Create a job
              </Button>

              <Button fullWidth component={NextLink} href="/companies/new">
                Create a company
              </Button>
            </Stack>
          </Box>
        </Grid.Col>

        <Grid.Col md={9} span={12}>
          <Title order={2} mb="md">
            Company and job overview
          </Title>

          <TextInput
            label="Search companies"
            onChange={e => setSearch(e.target.value)}
            mb="md"
          />

          {isLoading ? (
            <Center mt="xl">
              <Loader variant="bars" />
            </Center>
          ) : (
            <Stack>
              {data ? (
                <>
                  {data.user.companies.map(company => {
                    return (
                      <Paper p="sm" shadow="sm" key={company.slug}>
                        <Box
                          mb="xs"
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
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
                          <Stack spacing="xs">
                            {company.jobs.map(job => {
                              return (
                                <Box
                                  key={job.slug}
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
                                      '@media (max-width: 768px)': {
                                        marginTop: 10
                                      }
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
                              )
                            })}
                          </Stack>
                        ) : (
                          <Text
                            mt="sm"
                            sx={{ display: debounced ? 'none' : 'block' }}
                          >
                            This company does not have any jobs yet.
                          </Text>
                        )}
                      </Paper>
                    )
                  })}

                  {data.total > 16 && (
                    <Center>
                      <Pagination
                        total={data.total}
                        page={page}
                        onChange={setPage}
                        siblings={2}
                      />
                    </Center>
                  )}
                </>
              ) : (
                <Text>
                  You currently do not have any companies. Start by creating
                  one.
                </Text>
              )}
            </Stack>
          )}
        </Grid.Col>
      </Grid>
    </Layout>
  )
}

export default EmployerAccountPage
