import {
  Box,
  Button,
  Input,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useRef, useState } from 'react'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import { locations } from '~/constants/general'
import regex from '~/constants/regex'
import type { Company } from '~/types/types'

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
  ssr: false
})

const NewCompany = () => {
  const router = useRouter()
  const [logo, setLogo] = useState<any>()
  const [logoPreview, setLogoPreview] = useState<any>(null)
  const [description, setDescription] = useState('<p></p>')
  const [loading, setLoading] = useState(false)

  const logoRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      logo: '',
      region: '',
      city: '',
      website: ''
    },

    validate: {
      website: value => {
        if (value.length > 0 && !regex.website.test(value)) {
          return 'Invalid URL'
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
      const { data } = await axios.post<Company>('/api/company', formData)

      if (logo) {
        await handleFileUpload(logo, data.id)
      }

      router.push(data.slug as string)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }

    showNotification({
      title: 'Company created successfully',
      message: 'You can now create a new job for this company',
      color: 'green'
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File
    setLogoPreview(URL.createObjectURL(file))
    setLogo(file)
  }

  const handleFileUpload = async (logo: File, companyId: string) => {
    const formData = new FormData()

    formData.append('companyId', companyId)
    formData.append('logo', logo)

    try {
      const { data } = await axios.post('/api/company/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return data
    } catch (err) {
      console.error(err)
      throw new Error("Couldn't upload images")
    }
  }

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (status === 'loading') {
    return null
  }

  return (
    <Layout>
      <SEO title="Create a new company" noindex />

      <Box sx={{ maxWidth: 750 }} mx="auto">
        <Title mb={30}>Create a new company</Title>

        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            mb="md"
            required
            label="Name"
            {...form.getInputProps('name')}
          />

          <Input.Wrapper required id="description" label="Description" mb="md">
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
          </Input.Wrapper>

          <Input.Wrapper label="Company Logo" mb="md" sx={{ display: 'none' }}>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={logoRef}
            />
          </Input.Wrapper>

          <Button
            mb="md"
            variant="default"
            leftIcon={
              <Box
                component="svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                width={25}
                height={25}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </Box>
            }
            fullWidth
            sx={{ height: 65 }}
            onClick={() => logoRef.current?.click()}
          >
            Upload your company logo
          </Button>

          {logoPreview && (
            <Box sx={{ display: 'flex', alignItems: 'center' }} mb="md">
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
                  src={logoPreview}
                  alt="logo preview"
                  layout="fill"
                  objectFit="contain"
                />
              </Box>

              <Text ml="lg">
                This is a preview of how your company logo will be displayed
                across the website.
              </Text>
            </Box>
          )}

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 768, cols: 1 }]}
            mb="md"
          >
            <Select
              required
              label="Company Location"
              data={locations}
              searchable
              nothingFound="No options"
              {...form.getInputProps('region')}
            />

            <TextInput label="Company City" {...form.getInputProps('city')} />
          </SimpleGrid>

          <TextInput
            mb="xl"
            label="Website"
            placeholder="https://yourwebsite.com/"
            {...form.getInputProps('website')}
            pattern={`${regex.website}`}
          />

          <Button type="submit" loading={loading}>
            Create company
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default NewCompany
