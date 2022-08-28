import { Box, Button, Group, MultiSelect, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'
import qs from 'query-string'
import type { FC } from 'react'
import { categories, locations, types } from '~/constants/general'

interface IProps {
  setQuery: (query: string) => void
}

const JobFilters: FC<IProps> = ({ setQuery }) => {
  const router = useRouter()
  const plausible = usePlausible()

  const { title, location, category, type } = router.query

  const form = useForm({
    initialValues: {
      title: title || '',
      location: location ? (location as string).split(',') : [],
      category: category ? (category as string).split(',') : [],
      type: type ? (type as string).split(',') : []
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    const queryString = qs.stringify(values, {
      skipNull: true,
      skipEmptyString: true,
      arrayFormat: 'comma',
      arrayFormatSeparator: ','
    })

    if (queryString) {
      plausible('job-search', {
        props: {
          query: queryString
        }
      })

      setQuery(queryString)
      router.push(`/jobs?${queryString}`, undefined, { shallow: true })
    } else {
      setQuery('')
      router.push('/jobs', undefined, { shallow: true })
    }
  }

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        mb="md"
        label="Search by job title"
        {...form.getInputProps('title')}
      />

      <MultiSelect
        mb="md"
        label="Location"
        data={locations}
        {...form.getInputProps('location')}
      />

      <MultiSelect
        mb="md"
        label="Category"
        data={categories}
        {...form.getInputProps('category')}
      />

      <MultiSelect
        mb="md"
        label="Type"
        data={types}
        {...form.getInputProps('type')}
      />

      <Group grow>
        <Button type="submit">Search</Button>

        <Button
          type="reset"
          variant="outline"
          onClick={() => {
            form.setValues({
              title: '',
              location: [],
              category: [],
              type: []
            })
          }}
        >
          Reset
        </Button>
      </Group>
    </Box>
  )
}

export default JobFilters
