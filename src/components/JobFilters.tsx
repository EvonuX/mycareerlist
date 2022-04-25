import { TextInput, Select, Group, Button, Box } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import router from 'next/router'
import { locations, categories, types } from '~/constants/general'
import qs from 'query-string'
import type { FC } from 'react'

interface IProps {
  setQuery: (query: string) => void
}

const JobFilters: FC<IProps> = ({ setQuery }) => {
  const form = useForm({
    initialValues: {
      title: router.query.title || '',
      location: router.query.location || '',
      category: router.query.category || '',
      type: router.query.type || ''
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    const queryString = qs.stringify(values, {
      skipNull: true,
      skipEmptyString: true
    })

    if (queryString) {
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
        mb={10}
        label="Search by job title"
        {...form.getInputProps('title')}
      />

      <Select
        mb={10}
        label="Location"
        data={[{ label: 'All', value: '' }, ...locations]}
        {...form.getInputProps('location')}
      />
      <Select
        mb={10}
        label="Category"
        data={[{ label: 'All', value: '' }, ...categories]}
        {...form.getInputProps('category')}
      />
      <Select
        mb={15}
        label="Type"
        data={[{ label: 'All', value: '' }, ...types]}
        {...form.getInputProps('type')}
      />
      <Group grow>
        <Button type="submit">Search</Button>

        <Button
          type="reset"
          variant="outline"
          onClick={() =>
            form.setValues({
              title: '',
              location: '',
              category: '',
              type: ''
            })
          }
        >
          Reset
        </Button>
      </Group>
    </Box>
  )
}

export default JobFilters
