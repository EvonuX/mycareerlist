import {
  Modal,
  Box,
  TextInput,
  Textarea,
  SimpleGrid,
  Select,
  InputWrapper,
  Button,
  RadioGroup,
  Radio
} from '@mantine/core'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { FC, useState } from 'react'
import StarPicker from 'react-star-picker'
import { showNotification } from '@mantine/notifications'
import { useQueryClient } from 'react-query'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  companyId: string
}

const InterviewForm: FC<IProps> = ({ open, setOpen, companyId }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      position: '',
      year: 2022,
      hr: '',
      technical: '',
      duration: 2,
      difficulty: '',
      offer: '',
      rating: 0,
      companyId
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      await axios.post('/api/interview', values)

      showNotification({
        title: 'Interview experience posted!',
        message: 'Thank you for your feedback',
        color: 'green'
      })

      queryClient.invalidateQueries('interviews')

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
      title="Interview experience form"
      centered
      size="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          mb="md"
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Position"
          mb="md"
          required
          autosize
          minRows={2}
          {...form.getInputProps('position')}
        />

        <Textarea
          label="HR interview"
          autosize
          minRows={2}
          mb="md"
          required
          {...form.getInputProps('hr')}
        />

        <Textarea
          label="Technical interview (if applicable)"
          autosize
          minRows={2}
          mb="md"
          {...form.getInputProps('technical')}
        />

        <SimpleGrid cols={2}>
          <Select
            label="What year was the interview?"
            mb="md"
            required
            data={[
              '2022',
              '2021',
              '2020',
              '2019',
              '2018',
              '2017',
              '2016',
              '2015'
            ]}
            defaultValue="2022"
            {...form.getInputProps('year')}
          />

          <Select
            label="How long was the selection process?"
            mb="md"
            required
            data={['1', '2', '3', '4', '5', '6']}
            placeholder="Select number of weeks"
            {...form.getInputProps('duration')}
          />
        </SimpleGrid>

        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]} mb="md">
          <RadioGroup
            label="How difficult was the inteview?"
            required
            {...form.getInputProps('difficulty')}
          >
            <Radio value="easy" label="Easy" />
            <Radio value="medium" label="Medium" />
            <Radio value="hard" label="Hard" />
          </RadioGroup>

          <InputWrapper label="Rating" required error={form.errors.rating}>
            {/* @ts-ignore */}
            <StarPicker
              value={form.values.rating}
              onChange={value => form.setFieldValue('rating', value as number)}
              name="rating"
            />
          </InputWrapper>
        </SimpleGrid>

        <RadioGroup
          label="Did you receive an offer?"
          required
          mb="lg"
          {...form.getInputProps('offer')}
        >
          <Radio value="accepted" label="Yes, I accepted it" />
          <Radio value="declined" label="Yes, I declined it" />
          <Radio value="no" label="Didn't receive an offer" />
        </RadioGroup>

        <Button type="submit" loading={loading}>
          Post interview experience
        </Button>
      </Box>
    </Modal>
  )
}

export default InterviewForm
