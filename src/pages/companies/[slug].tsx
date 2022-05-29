import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from 'react-query'
import InterviewItem from '~/components/InterviewItem'
import JobCard from '~/components/JobCard'
import Layout from '~/components/Layout'
import ReviewItem from '~/components/ReviewItem'
import SEO from '~/components/SEO'
import type { Company } from '~/types/types'
import { fetcher, formatDate, getLocation } from '~/utils/helpers'
import prisma from '~/utils/prisma'
import NotFoundPage from '../404'
import noImage from '../../../public/no-image.png'

const ReviewForm = dynamic(() => import('~/components/ReviewForm'), {
  ssr: false
})

const InterviewForm = dynamic(() => import('~/components/InterviewForm'), {
  ssr: false
})

interface IProps {
  company: Company
  stats: {
    reviews: {
      average: number
      count: number
    }
    interviews: {
      averageRating: number
      averageDuration: number
      count: number
    }
  }
}

const CompanyPage: NextPage<IProps> = ({ company, stats }) => {
  const { data: user } = useSession()
  const [opened, setOpened] = useState(false)
  const [interviewOpened, setInterviewOpened] = useState(false)

  const isUser = user?.userRole === 'USER'

  const fetchCompany = () => fetcher(`/api/company/${company.slug}`)

  const { data } = useQuery<IProps, Error>(
    ['company', company.slug],
    fetchCompany,
    {
      initialData: { company, stats }
    }
  )

  if (!data) {
    return <NotFoundPage />
  }

  return (
    <Layout>
      <SEO
        title={`Jobs at ${data.company.name}`}
        description={data.company.description ?? ''}
        image={data.company.logo ?? ''}
        url={`/companies/${data.company.slug}`}
      />

      <Grid>
        <Grid.Col span={12} md={3} sx={{ position: 'relative' }}>
          <Paper
            p="md"
            shadow="xs"
            sx={{ position: 'sticky', top: 20, textAlign: 'center' }}
          >
            <Box mb={10}>
              <Box
                mx="auto"
                sx={{
                  backgroundColor: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 5,
                  width: 100,
                  height: 100
                }}
              >
                <Image
                  src={data.company.logo || noImage}
                  alt={data.company.name}
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Title order={1} mb={10}>
                {data.company.name}
              </Title>

              <Group position="center" direction="column">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                    width="20"
                    height="20"
                    mr={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </Box>

                  <Text>{getLocation(company.city || '', company.region)}</Text>
                </Box>

                {data.company.website && (
                  <Button
                    component="a"
                    size="xs"
                    variant="outline"
                    href={data.company.website}
                    target="_blank"
                    rightIcon={
                      <Box
                        component="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                        width="18"
                        height="18"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </Box>
                    }
                  >
                    Website
                  </Button>
                )}
              </Group>
            </Box>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12} md={9}>
          <Tabs>
            <Tabs.Tab label="Description & Jobs">
              <Title order={2} mb="md">
                Company description
              </Title>

              <TypographyStylesProvider>
                <Text
                  dangerouslySetInnerHTML={{
                    __html: company.description as string
                  }}
                />
              </TypographyStylesProvider>

              <Title order={2} mb={15}>
                Active job postings ({data.company.jobs.length})
              </Title>

              <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]}>
                {data.company.jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </SimpleGrid>
            </Tabs.Tab>

            <Tabs.Tab label={`Reviews (${stats.reviews.count})`}>
              <Grid justify="space-between" align="center" mb="sm">
                <Grid.Col md={6}>
                  <Title order={2}>Company reviews</Title>

                  {stats.reviews.count > 0 && (
                    <Text mt="xs">Average rating: {stats.reviews.average}</Text>
                  )}
                </Grid.Col>

                {isUser && (
                  <Grid.Col
                    md={6}
                    sx={{
                      textAlign: 'right',

                      '@media (max-width: 768px)': {
                        textAlign: 'left'
                      }
                    }}
                  >
                    <Button onClick={() => setOpened(true)}>
                      Write a review
                    </Button>
                  </Grid.Col>
                )}
              </Grid>

              {data.company.reviews && (
                <Stack>
                  {data.company.reviews.map(review => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </Stack>
              )}
            </Tabs.Tab>

            <Tabs.Tab label={`Interviews (${stats.interviews.count})`}>
              <Grid justify="space-between" align="center" mb="sm">
                <Grid.Col md={6}>
                  <Title order={2}>Interview experiences</Title>
                </Grid.Col>

                {isUser && (
                  <Grid.Col
                    md={6}
                    sx={{
                      textAlign: 'right',

                      '@media (max-width: 768px)': {
                        textAlign: 'left'
                      }
                    }}
                  >
                    <Button onClick={() => setInterviewOpened(true)}>
                      Interview experience
                    </Button>
                  </Grid.Col>
                )}
              </Grid>

              {stats.interviews.averageRating && (
                <SimpleGrid
                  cols={2}
                  breakpoints={[{ maxWidth: 768, cols: 1 }]}
                  mb="xl"
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Text size="lg" weight="bold">
                      {stats.interviews.averageRating}
                    </Text>
                    <Text>Average interview rating</Text>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Text size="lg" weight="bold">
                      {stats.interviews.averageDuration} weeks
                    </Text>
                    <Text>Average selection process duration</Text>
                  </Box>
                </SimpleGrid>
              )}

              {data.company.interviews && (
                <Stack>
                  {data.company.interviews.map(interview => (
                    <InterviewItem key={interview.id} interview={interview} />
                  ))}
                </Stack>
              )}
            </Tabs.Tab>
          </Tabs>
        </Grid.Col>
      </Grid>

      {isUser && (
        <>
          <ReviewForm
            open={opened}
            setOpen={setOpened}
            companyId={data.company.id}
            companySlug={data.company.slug as string}
          />

          <InterviewForm
            open={interviewOpened}
            setOpen={setInterviewOpened}
            companyId={data.company.id}
            companySlug={data.company.slug as string}
          />
        </>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const companies = await prisma.company.findMany({
    select: {
      slug: true
    },
    where: {
      slug: {
        not: null
      }
    }
  })

  const paths = companies.map(company => {
    return {
      params: { slug: company.slug as string }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const company = await prisma.company.findUnique({
    where: {
      slug: context.params?.slug as string
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo: true,
      website: true,
      region: true,
      city: true,
      jobs: {
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          city: true,
          type: true,
          category: true,
          company: {
            select: {
              name: true,
              logo: true
            }
          }
        },
        where: {
          expired: {
            equals: false
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      reviews: {
        select: {
          id: true,
          title: true,
          content: true,
          rating: true,
          pros: true,
          cons: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      interviews: {
        select: {
          id: true,
          title: true,
          hr: true,
          technical: true,
          year: true,
          difficulty: true,
          rating: true,
          position: true,
          duration: true,
          offer: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!company) {
    return {
      notFound: true
    }
  }

  const transformedReviews = company.reviews.map(review => {
    return {
      ...review,
      createdAt: formatDate(review.createdAt)
    }
  })

  const transformedInterviews = company.interviews.map(interview => {
    return {
      ...interview,
      createdAt: formatDate(interview.createdAt)
    }
  })

  const reviews = await prisma.review.aggregate({
    where: {
      company: {
        slug: context.params?.slug as string
      }
    },
    _avg: {
      rating: true
    },
    _count: true
  })

  const interviews = await prisma.interview.aggregate({
    where: {
      company: {
        slug: context.params?.slug as string
      }
    },
    _avg: {
      rating: true,
      duration: true
    },
    _count: true
  })

  return {
    props: {
      company: {
        ...company,
        reviews: transformedReviews,
        interviews: transformedInterviews
      },
      stats: {
        reviews: {
          average: reviews._avg.rating,
          count: reviews._count
        },
        interviews: {
          averageRating: interviews._avg.rating,
          averageDuration: interviews._avg.duration,
          count: interviews._count
        }
      }
    }
  }
}

export default CompanyPage
