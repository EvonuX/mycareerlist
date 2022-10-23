import { Anchor, Badge, Box, Paper, Rating, Text } from '@mantine/core'
import Link from 'next/link'
import type { FC } from 'react'
import type { Review } from '~/types/types'

interface IProps {
  review: Review
  showCompanyInfo?: boolean
}

const ReviewItem: FC<IProps> = ({ review, showCompanyInfo = false }) => {
  return (
    <Paper p="sm" shadow="sm">
      <Box>
        <Rating value={review.rating} name="rating" readOnly />

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
        <Box mb="md" mt="md">
          <Badge radius="sm" mb="xs" color="green">
            Pros
          </Badge>

          <Text>{review.pros}</Text>
        </Box>
      )}

      {review.cons && (
        <Box>
          <Badge radius="sm" mb="xs" color="red">
            Cons
          </Badge>

          <Text>{review.cons}</Text>
        </Box>
      )}

      {review.createdAt && (
        <Text size="xs" color="dimmed" mt="sm">
          <>Posted on: {review.createdAt}</>
        </Text>
      )}
    </Paper>
  )
}

export default ReviewItem
