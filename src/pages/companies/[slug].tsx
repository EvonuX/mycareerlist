import {
  Anchor,
  Badge,
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

      <Paper sx={{ display: 'flex' }} p="md" shadow="xs">
        <Box mr={10}>
          <Box
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
              src={data.company.logo || ''}
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

          <Group>
            <Badge radius="xs">
              {getLocation(company.city || '', company.region)}
            </Badge>

            {data.company.website && (
              <Badge radius="xs">
                <Anchor
                  size="xs"
                  href={data.company.website}
                  target="_blank"
                  sx={{ color: 'inherit' }}
                >
                  Website
                </Anchor>
              </Badge>
            )}
          </Group>
        </Box>
      </Paper>

      <TypographyStylesProvider>
        <Text
          dangerouslySetInnerHTML={{ __html: company.description as string }}
        />
      </TypographyStylesProvider>

      <Title order={2} mb={15}>
        Active job postings
      </Title>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]}>
        {data.company.jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <Tabs mt="xl">
        <Tabs.Tab label={`Reviews (${stats.reviews.count})`}>
          <Grid justify="space-between" align="center" mb="sm">
            <Grid.Col md={6}>
              <Title order={2} mb="xs">
                Company reviews
              </Title>

              {stats.reviews.count > 0 && (
                <Text>Average rating: {stats.reviews.average}</Text>
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
                <Button onClick={() => setOpened(true)}>Write a review</Button>
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
              <Title order={2} mb="xs">
                Interview experiences
              </Title>
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

          {/* <Box>
            <Text>Average interview rating:</Text>
            <Text>{stats.interviews.averageRating}</Text>
          </Box>

          <Box>
            <Text>Average selection process duration:</Text>
            <Text>{stats.interviews.averageDuration} weeks</Text>
          </Box> */}

          {data.company.interviews && (
            <Stack>
              {data.company.interviews.map(interview => (
                <InterviewItem key={interview.id} interview={interview} />
              ))}
            </Stack>
          )}
        </Tabs.Tab>

        {/* <Tabs.Tab label="Salaries">COMING SOON</Tabs.Tab> */}
      </Tabs>

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
    },
    revalidate: 10
  }
}

export default CompanyPage
