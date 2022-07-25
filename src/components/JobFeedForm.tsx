import { Box, Button, Group, Modal, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FC, useEffect } from 'react'
import { categories, locations, types } from '~/constants/general'

interface IProps {
  loading: boolean
  opened: boolean
  setOpened: (opened: boolean) => void
  onSubmit: (values: any) => void
  preferences: {
    location: string[]
    category: string[]
    type: string[]
  }
}

const JobFeedForm: FC<IProps> = ({
  loading,
  opened,
  setOpened,
  onSubmit,
  preferences
}) => {
  const form = useForm({
    initialValues: {
      location: [''],
      category: [''],
      type: ['']
    }
  })

  useEffect(() => {
    form.setValues({
      location: Array.isArray(preferences.location)
        ? preferences.location
        : [preferences.location] || [''],
      category: Array.isArray(preferences.category)
        ? preferences.category
        : [preferences.category] || [''],
      type: Array.isArray(preferences.type)
        ? preferences.type
        : [preferences.type] || ['']
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences])

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Customize your job feed"
      centered
    >
      <Box
        component="form"
        onSubmit={form.onSubmit(values => onSubmit(values))}
      >
        <MultiSelect
          mb="md"
          label="Location"
          data={locations}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('location')}
        />

        <MultiSelect
          mb="md"
          label="Category"
          data={categories}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('category')}
        />

        <MultiSelect
          mb="xl"
          label="Type"
          data={types}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('type')}
        />

        <Group grow>
          <Button type="submit" loading={loading}>
            Save
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpened(false)}
          >
            Close
          </Button>
        </Group>
      </Box>
    </Modal>
  )
}

export default JobFeedForm
