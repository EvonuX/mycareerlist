import { Box, Paper, Rating, Text, Title } from '@mantine/core'
import type { FC } from 'react'
import type { Interview } from '~/types/types'
import { getInterviewDifficulty, getInterviewOffer } from '~/utils/helpers'

interface IProps {
  interview: Interview
}

const InterviewItem: FC<IProps> = ({ interview }) => {
  return (
    <Paper p="sm" shadow="sm">
      <Title order={3}>{interview.title}</Title>

      <Text color="dimmed" size="xs" mb="xs">
        <>Posted on: {interview.createdAt}</>
      </Text>

      <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3}>
        <Text size="sm" mr={3}>
          Rating:
        </Text>

        <Box sx={{ pointerEvents: 'none', lineHeight: 1 }}>
          <Rating value={interview.rating} name="rating" size="xl" readOnly />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Text size="sm" mr={5}>
          Interview difficulty:
        </Text>
        <Text size="sm">{getInterviewDifficulty(interview.difficulty)}</Text>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }} mb="sm">
        <Text size="sm" mr={5}>
          Selection duration:
        </Text>
        <Text size="sm">{interview.duration} week(s)</Text>
      </Box>

      <Title mb="xs" order={4}>
        HR interview
      </Title>
      <Text mb="lg">{interview.hr}</Text>

      {interview.technical && (
        <>
          <Title mb="xs" order={4}>
            Technical interview
          </Title>
          <Text mb="lg">{interview.technical}</Text>
        </>
      )}

      <Text sx={{ fontStyle: 'italic' }}>
        Applied for: {interview.position} in {interview.year}
      </Text>
      <Text sx={{ fontStyle: 'italic' }}>
        {getInterviewOffer(interview.offer)}
      </Text>
    </Paper>
  )
}

export default InterviewItem
