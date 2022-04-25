import { Box, Divider, Paper, Text } from '@mantine/core'
import type { Review } from '@prisma/client'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

const StarPicker = dynamic(() => import('react-star-picker'), {
  ssr: false
})

interface IProps {
  review: Review
}

const ReviewItem: FC<IProps> = ({ review }) => {
  return (
    <Paper p="sm" shadow="sm">
      <Box>
        {/* @ts-ignore */}
        <StarPicker
          value={review.rating}
          disabled={true}
          name="rating"
          size={22}
        />

        <Text size="lg">{review.title}</Text>
      </Box>

      <Text my="sm">{review.content}</Text>

      {review.pros && (
        <Text sx={{ fontStyle: 'italic' }}>Pros: {review.pros}</Text>
      )}

      {review.cons && (
        <Text sx={{ fontStyle: 'italic' }}>Cons: {review.cons}</Text>
      )}
    </Paper>
  )
}

export default ReviewItem
