import { Button, SimpleGrid, Stack, Title } from '@mantine/core'
import type { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import CompanyCard from '~/components/CompanyCard'
import JobCard from '~/components/JobCard'
import ReviewItem from '~/components/ReviewItem'
import SEO from '~/components/SEO'
import { Company, Job, Review } from '~/types/types'
import prisma from '~/utils/prisma'
import Layout from '../components/Layout'

const Newsletter = dynamic(() => import('~/components/Newsletter'), {
  ssr: false
})

interface IProps {
  jobs: Job[]
  companies: Company[]
  reviews: Review[]
}

const Home: NextPage<IProps> = ({ jobs, companies, reviews }) => {
  return (
    <Layout>
      <SEO title="My Career List" />

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]} mb="md">
        <Title>Latest featured jobs</Title>

        <Link href="/jobs" passHref>
          <Button
            variant="light"
            sx={{
              width: 'fit-content',
              alignSelf: 'center',
              justifySelf: 'flex-end',

              '@media (max-width: 768px)': {
                justifySelf: 'flex-start'
              }
            }}
          >
            View all
          </Button>
        </Link>
      </SimpleGrid>

      <SimpleGrid
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'md', cols: 2 }
        ]}
      >
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <SimpleGrid
        cols={1}
        breakpoints={[{ minWidth: 480, cols: 2 }]}
        mb="md"
        mt="lg"
      >
        <Title>Latest companies</Title>

        <Link href="/companies" passHref>
          <Button
            variant="light"
            sx={{
              width: 'fit-content',
              alignSelf: 'center',
              justifySelf: 'flex-end',

              '@media (max-width: 768px)': {
                justifySelf: 'flex-start'
              }
            }}
          >
            View all
          </Button>
        </Link>
      </SimpleGrid>

      <SimpleGrid
        breakpoints={[
          { maxWidth: 'xs', cols: 2 },
          { minWidth: 'md', cols: 4 }
        ]}
      >
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </SimpleGrid>

      {reviews.length > 0 && (
        <>
          <Title mb="md" mt="lg">
            Latest reviews
          </Title>

          <Stack>
            {reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </Stack>
        </>
      )}

      <Newsletter />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const jobs = await prisma.job.findMany({
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      category: true,
      type: true,
      applyLink: true,
      location: true,
      city: true,
      featured: true,
      company: {
        select: {
          name: true,
          logo: true
        }
      }
    },
    where: {
      expired: {
        not: true
      },
      draft: {
        not: true
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const companies = await prisma.company.findMany({
    take: 8,
    select: {
      id: true,
      name: true,
      logo: true,
      slug: true,
      _count: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      jobs: {
        none: {
          expired: true
        }
      }
    }
  })

  const reviews = await prisma.review.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      content: true,
      rating: true,
      pros: true,
      cons: true,
      status: true,
      company: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    props: {
      jobs,
      companies,
      reviews
    }
  }
}

export default Home
