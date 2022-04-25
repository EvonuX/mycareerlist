import {
  Box,
  Button,
  Image,
  Input,
  InputWrapper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Company } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import { locations } from '~/constants/general'
import regex from '~/constants/regex'

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
  ssr: false
})

const NewCompany = () => {
  const router = useRouter()
  const [logo, setLogo] = useState<any>()
  const [logoPreview, setLogoPreview] = useState<any>(null)
  const [description, setDescription] = useState('<p></p>')
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      logo: '',
      region: '',
      city: '',
      website: ''
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

          <InputWrapper required id="description" label="Description" mb="md">
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

          <InputWrapper label="Company Logo" mb="md">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </InputWrapper>

          {logoPreview && (
            <Box sx={{ display: 'flex', alignItems: 'center' }} mb="md">
              <Box sx={{ width: '100px', height: '100px' }}>
                <Image
                  src={logoPreview}
                  alt="logo preview"
                  width={100}
                  height={100}
                  sx={{ borderRadius: '10px', overflow: 'hidden' }}
                />
              </Box>

              <Text ml="lg">
                This is a preview of how your company logo will be displayed
                across the website.
              </Text>
            </Box>
          )}

          <SimpleGrid cols={2} mb="md">
            <Select
              required
              label="Compoany Location"
              data={locations}
              searchable
              nothingFound="No options"
              {...form.getInputProps('region')}
            />

            <TextInput label="Company City" {...form.getInputProps('city')} />
          </SimpleGrid>

          <TextInput
            mb={20}
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
