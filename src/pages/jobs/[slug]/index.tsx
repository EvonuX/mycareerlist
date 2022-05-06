import {
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import JobCard from '~/components/JobCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import { categories, locations, types } from '~/constants/general'
import type { Job } from '~/types/types'
import prisma from '~/utils/prisma'

const Newsletter = dynamic(() => import('~/components/Newsletter'), {
  ssr: false
})

interface IProps {
  job: Job
  relatedJobs: Job[]
}

const JobPage: NextPage<IProps> = ({ job, relatedJobs }) => {
  const { data: user } = useSession()

  const category = categories.find(c => c.value === job.category)
  const type = types.find(t => t.value === job.type)
  const location = locations.find(l => l.value === job.location)
  const position = job.city
    ? `${location?.label}, ${job.city}`
    : location?.label

  const isSaved = !!!job.savedBy.find(
    (s: { id: string }) => s.id === user?.userId
  )

  const [jobSaved, setJobSaved] = useState(isSaved || false)

  const handleSave = async () => {
    try {
      await axios.put('/api/job', {
        slug: job.slug,
        save: jobSaved
      })

      const title = jobSaved ? 'Job saved' : 'Job no longer saved'
      const message = jobSaved ? 'You can now find it in your account' : ''

      showNotification({
        title,
        message,
        color: 'green',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      })

      setJobSaved(!jobSaved)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAnalytics = useCallback(async () => {
    try {
      await axios.post(`/api/job/${job.slug}/analytics`, {
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })
    } catch (err) {
      console.error(err)
    }
  }, [job.slug])

  useEffect(() => {
    handleAnalytics()
  }, [handleAnalytics, job.slug])

  return (
    <Layout>
      <SEO
        title={`${job.title} at ${job.company.name}`}
        description={job.description as string}
        image={job.company.logo as string}
        url={`/jobs/${job.slug}`}
      />

      <Grid>
        <Grid.Col md={9}>
          <Title order={1}>{job.title}</Title>

          <Group my="lg">
            <Badge radius="xs">{position}</Badge>
            <Badge radius="xs">{type?.label}</Badge>
            <Badge radius="xs">{category?.label}</Badge>
          </Group>

          <TypographyStylesProvider>
            <Text
              dangerouslySetInnerHTML={{ __html: job.description as string }}
              sx={{ wordBreak: 'break-word' }}
            />
          </TypographyStylesProvider>

          <Button component="a" href={job.applyLink} target="_blank">
            Apply for this job
          </Button>
        </Grid.Col>

        <Grid.Col md={3}>
          <Box
            sx={{
              textAlign: 'center',
              position: 'sticky',
              top: 20
            }}
          >
            <Paper shadow="xs" p="md">
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  borderRadius: 5
                }}
                mx="auto"
                mb="md"
              >
                <Image
                  src={job.company.logo || 'https://picsum.photos/700/700'}
                  alt={job.title}
                  layout="fixed"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </Box>

              <Title order={2} mb="md">
                {job.company.name}
              </Title>

              <Group align="center" direction="column" mb="md">
                <Badge radius="xs" variant="outline">
                  {job.company._count.jobs} active jobs
                </Badge>
                <Badge radius="xs" variant="outline">
                  {job.company._count.reviews} reviews
                </Badge>
              </Group>

              <Group direction="column" grow mx="xl">
                <Link href={`/companies/${job.company.slug}`} passHref>
                  <Button variant="light">View Company Profile</Button>
                </Link>

                {job.company.website && (
                  <Button
                    variant="light"
                    component="a"
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Website
                  </Button>
                )}
              </Group>
            </Paper>

            <Group mt="md" grow>
              <Button
                component="a"
                href={job.applyLink}
                target="_blank"
                sx={{
                  '@media (max-width: 768px)': {
                    display: 'none'
                  }
                }}
              >
                Apply for job
              </Button>

              {user?.userRole === 'USER' && (
                <Button variant="outline" onClick={handleSave}>
                  {jobSaved ? 'Save job' : 'Unsave job'}
                </Button>
              )}
            </Group>
          </Box>
        </Grid.Col>
      </Grid>

      <Title order={3} mb={15} mt={25}>
        Related jobs
      </Title>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]}>
        {relatedJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <Newsletter />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const jobs = await prisma.job.findMany({
    select: {
      slug: true
    },
    where: {
      expired: {
        not: true
      },
      slug: {
        not: null
      }
    }
  })

  const paths = jobs.map(job => {
    return {
      params: { slug: job.slug as string }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true
    }
  }

  const job = await prisma.job.findUnique({
    where: {
      slug: params.slug as string
    },
    select: {
      title: true,
      description: true,
      slug: true,
      category: true,
      type: true,
      applyLink: true,
      location: true,
      city: true,
      expired: true,
      savedBy: {
        select: {
          id: true
        }
      },
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
          slug: true,
          _count: true
        }
      }
    }
  })

  if (!job || job.expired) {
    return {
      notFound: true
    }
  }

  const relatedJobs = await prisma.job.findMany({
    take: 6,
    where: {
      category: {
        equals: job.category
      },
      slug: {
        not: {
          equals: job.slug
        }
      },
      expired: {
        not: true
      },
      draft: {
        not: true
      }
    },
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
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  })

  return {
    props: {
      job,
      relatedJobs
    },
    revalidate: 10
  }
}

export default JobPage
