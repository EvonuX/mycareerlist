import {
  Modal,
  Box,
  TextInput,
  Textarea,
  SimpleGrid,
  Select,
  Button,
  Alert,
  Input,
  Rating
} from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { FC, useState } from 'react'
import { showNotification } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  companyId: string
  companySlug: string
}

const ReviewForm: FC<IProps> = ({ open, setOpen, companyId, companySlug }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      rating: 0,
      pros: '',
      cons: '',
      status: '',
      companyId
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      await axios.post(`/api/company/${companySlug}/reviews`, values)

      showNotification({
        title: 'Review posted!',
        message: 'Thank you for your feedback',
        color: 'green'
      })

      queryClient.invalidateQueries(['company'])

      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title="Review form"
      centered
      size="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Alert title="Your trust is our top concern!" mb="md">
          Companies can&lsquo;t alter or remove reviews.
        </Alert>

        <TextInput
          label="Title"
          mb="md"
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Review"
          mb="md"
          required
          autosize
          minRows={2}
          {...form.getInputProps('content')}
        />

        <Textarea
          label="Pros"
          autosize
          minRows={2}
          mb="md"
          {...form.getInputProps('pros')}
        />

        <Textarea
          label="Cons"
          autosize
          minRows={2}
          mb="md"
          {...form.getInputProps('cons')}
        />

        <SimpleGrid cols={2}>
          <Select
            label="Employment status"
            {...form.getInputProps('status')}
            required
            data={['Employed', 'Previously employed']}
          />

          <Input.Wrapper label="Rating" required mb="md">
            <Rating
              value={form.values.rating}
              onChange={value => form.setFieldValue('rating', value)}
              name="rating"
              size="xl"
            />
          </Input.Wrapper>
        </SimpleGrid>

        <Button type="submit" loading={loading}>
          Post review
        </Button>
      </Box>
    </Modal>
  )
}

export default ReviewForm
