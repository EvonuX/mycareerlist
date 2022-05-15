import {
  Alert,
  Box,
  Button,
  InputWrapper,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import { categories, locations, types } from '~/constants/general'
import regex from '~/constants/regex'
import type { Company } from '~/types/types'
import prisma from '~/utils/prisma'

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
  ssr: false
})

interface IProps {
  companies: Company[]
}

const NewJob: NextPage<IProps> = ({ companies }) => {
  const router = useRouter()
  const [description, setDescription] = useState('<p></p>')
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      location: '',
      type: '',
      category: '',
      city: '',
      applyLink: '',
      salaryMin: 0,
      salaryMax: 0,
      companyId: null
    },

    validate: {
      applyLink: value => {
        if (!regex.website.test(value) || !regex.email.test(value)) {
          return 'Invalid URL or email address'
        }
      }
    }
  })

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    form.setFieldValue('description', value)
  }

  const handleSubmit = async (formData: typeof form.values) => {
    setLoading(true)

    try {
      const { data } = await axios.post('/api/job', formData)

      router.push(`/jobs/${data.slug}/payment`)
    } catch (err) {
      showNotification({
        title: 'An error occured',
        message: 'Please check the form again or try again later',
        color: 'red'
      })

      throw new Error('Failed to create new job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <SEO title="Create a new job" noindex />

      <Box sx={{ maxWidth: 750 }} mx="auto">
        <Title mb="xl">Create a new job posting</Title>

        {!companies.length ? (
          <Alert
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="No companies found"
          >
            <Text mb="md">
              To create a job posting you first need to create a company to
              assign it to. You can create a company by clicking on the button
              below.
            </Text>

            <Link href="/companies/new" passHref>
              <Button size="xs">Create a company</Button>
            </Link>
          </Alert>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              mb="md"
              required
              label="Job Title"
              {...form.getInputProps('title')}
            />

            <InputWrapper
              required
              id="description"
              label="Job Description"
              mb="md"
            >
              <RichTextEditor
                value={description}
                onChange={handleDescriptionChange}
                sx={{ minHeight: 250 }}
                controls={[
                  ['bold', 'italic', 'underline', 'link'],
                  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                  ['orderedList', 'unorderedList'],
                  ['alignLeft', 'alignCenter', 'alignRight']
                ]}
              />
            </InputWrapper>

            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: 768, cols: 1 }]}
              mb="md"
            >
              <Select
                required
                label="Job Location"
                data={locations}
                searchable
                nothingFound="No options"
                {...form.getInputProps('location')}
              />

              <TextInput label="Job City" {...form.getInputProps('city')} />
            </SimpleGrid>

            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: 768, cols: 1 }]}
              mb="md"
            >
              <Select
                required
                label="Job Category"
                data={categories}
                searchable
                nothingFound="No options"
                {...form.getInputProps('category')}
              />

              <Select
                required
                label="Job Type"
                data={types}
                searchable
                nothingFound="No options"
                {...form.getInputProps('type')}
              />
            </SimpleGrid>

            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: 768, cols: 1 }]}
              mb="md"
            >
              <TextInput
                label="Application Link or Email Address"
                placeholder="https://yourwebsite.com/"
                required
                {...form.getInputProps('applyLink')}
              />

              <Select
                required
                label="Company"
                data={companies.map(c => ({ value: c.id, label: c.name }))}
                searchable
                nothingFound="No companies found"
                {...form.getInputProps('companyId')}
              />
            </SimpleGrid>

            <SimpleGrid
              cols={2}
              breakpoints={[{ maxWidth: 768, cols: 1 }]}
              mb="md"
            >
              <InputWrapper label="Salary Range">
                <SimpleGrid cols={2} mb="md">
                  <NumberInput
                    aria-label="Min"
                    placeholder="Min"
                    hideControls
                    min={0}
                    {...form.getInputProps('salaryMin')}
                    icon={
                      <Box
                        component="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                        width={25}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </Box>
                    }
                  />
                  <NumberInput
                    aria-label="Max"
                    placeholder="Max"
                    hideControls
                    min={0}
                    {...form.getInputProps('salaryMax')}
                    icon={
                      <Box
                        component="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                        width={25}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </Box>
                    }
                  />
                </SimpleGrid>
              </InputWrapper>
            </SimpleGrid>

            <Button type="submit" mt="sm" loading={loading}>
              Next step
            </Button>
          </form>
        )}
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session || session.userRole !== 'EMPLOYER') {
    return {
      redirect: {
        destination: '/?noPermissions=true',
        permanent: false
      }
    }
  }

  const companies = await prisma.company.findMany({
    where: {
      userId: session.userId
    },
    select: {
      id: true,
      name: true
    }
  })

  return {
    props: {
      companies
    }
  }
}

export default NewJob
