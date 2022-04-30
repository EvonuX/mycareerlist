import {
  Anchor,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from 'react-query'
import JobCard from '~/components/JobCard'
import Layout from '~/components/Layout'
import ReviewItem from '~/components/ReviewItem'
import SEO from '~/components/SEO'
import { locations } from '~/constants/general'
import type { Company, Review } from '~/types/types'
import { fetcher } from '~/utils/helpers'
import prisma from '~/utils/prisma'

const ReviewForm = dynamic(() => import('~/components/ReviewForm'), {
  ssr: false
})

interface IProps {
  company: Company
  reviewStats: {
    average: number
    count: number
  }
}

const CompanyPage: NextPage<IProps> = ({ company, reviewStats }) => {
  const location = locations.find(l => l.value === company.region)
  const position = company.city
    ? `${location?.label}, ${company.city}`
    : location?.label

  const [opened, setOpened] = useState(false)

  const fetchReviews = () => fetcher(`/api/review?companyId=${company.id}`)

  const { data } = useQuery<Review[]>('reviews', fetchReviews, {
    initialData: company.reviews
  })

  return (
    <Layout>
      <SEO
        title={company.name}
        description={company.description as string}
        image={company.logo as string}
        url={`/companies/${company.slug}`}
      />

      <Paper sx={{ display: 'flex' }} p="md" shadow="xs">
        <Box mr={10}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 5,
              width: 100,
              height: 100
            }}
          >
            <Image
              src={company.logo || ''}
              alt={company.name}
              layout="fill"
              objectFit="cover"
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
            {company.name}
          </Title>

          <Group>
            <Badge radius="xs">{position}</Badge>

            {company.website && (
              <Badge radius="xs">
                <Anchor
                  size="xs"
                  href={company.website}
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
        {company.jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <Grid justify="space-between" align="center" mb={15} mt={25}>
        <Grid.Col md={6}>
          <Title order={2} mb="sm">
            Company reviews ({reviewStats.count})
          </Title>

          {reviewStats.count > 0 && (
            <Text>Average rating: {reviewStats.average}</Text>
          )}
        </Grid.Col>

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
      </Grid>

      <Divider mb="xl" mt={-5} />

      {/* @ts-ignore */}
      <ReviewForm open={opened} setOpen={setOpened} companyId={company.id} />

      {data && (
        <Stack>
          {data.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </Stack>
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
      },
      jobs: {
        every: {
          expired: {
            equals: false
          }
        }
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
          status: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
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

  if (!company) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      company,
      reviewStats: {
        average: reviews._avg.rating,
        count: reviews._count
      }
    },
    revalidate: 10
  }
}

export default CompanyPage
