import { Box, Button, Group, Modal, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import type { FC } from 'react'
import { categories, locations, types } from '~/constants/general'

interface IProps {
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
  opened,
  setOpened,
  onSubmit,
  preferences
}) => {
  const form = useForm({
    initialValues: {
      location: preferences.location || '',
      category: preferences.category || '',
      type: preferences.type || ''
    }
  })

  const defaultLocation =
    typeof preferences.location === 'object'
      ? preferences.location
      : [preferences.location]
  const defaultCategory =
    typeof preferences.category === 'object'
      ? preferences.category
      : [preferences.category]
  const defaultType =
    typeof preferences.type === 'object' ? preferences.type : [preferences.type]

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
          defaultValue={defaultLocation}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('location')}
        />

        <MultiSelect
          mb="md"
          label="Category"
          data={categories}
          defaultValue={defaultCategory}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('category')}
        />

        <MultiSelect
          mb="xl"
          label="Type"
          data={types}
          defaultValue={defaultType}
          clearButtonLabel="Clear selection"
          searchable
          {...form.getInputProps('type')}
        />

        <Group grow>
          <Button type="submit">Save</Button>

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
