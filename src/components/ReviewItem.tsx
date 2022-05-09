import { Anchor, Badge, Box, Paper, Text } from '@mantine/core'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { FC } from 'react'
import type { Review } from '~/types/types'

const StarPicker = dynamic(() => import('react-star-picker'), {
  ssr: false
})

interface IProps {
  review: Review
  showCompanyInfo?: boolean
}

const ReviewItem: FC<IProps> = ({ review, showCompanyInfo = false }) => {
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

        <Text size="lg" weight={600}>
          {review.title}
        </Text>

        {showCompanyInfo && (
          <Text size="sm">
            <span>for </span>

            <Link href={`/companies/${review.company.slug}`} passHref>
              <Anchor>{review.company.name}</Anchor>
            </Link>
          </Text>
        )}

        <Text size="xs" color="dimmed">
          Status: {review.status}
        </Text>
      </Box>

      <Text mt="sm">{review.content}</Text>

      {review.pros && (
        <Box mb="md" mt="sm">
          <Badge radius="sm" color="green">
            Pros
          </Badge>

          <Text sx={{ fontStyle: 'italic' }}>{review.pros}</Text>
        </Box>
      )}

      {review.cons && (
        <Box>
          <Badge radius="sm" color="red">
            Cons
          </Badge>

          <Text sx={{ fontStyle: 'italic' }}>{review.cons}</Text>
        </Box>
      )}
    </Paper>
  )
}

export default ReviewItem
