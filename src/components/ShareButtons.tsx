import { Button, Group } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { FC, useEffect } from 'react'

interface IProps {
  title: string
  url: string
}

const ShareButtons: FC<IProps> = ({ title, url }) => {
  const urlValue = `https://mycareerlist.vercel.app${url}`
  const buttonSize = 'xs'
  const buttonVariant = 'light'

  const shareUrl = encodeURIComponent(urlValue)
  const shareTitle = encodeURIComponent(title)

  const clipboard = useClipboard({ timeout: 500 })

  useEffect(() => {
    if (clipboard.copied) {
      showNotification({
        title: 'Job link copied',
        message: 'Feel free to paste it',
        color: 'green'
      })
    }
  }, [clipboard])

  return (
    <Group>
      <Button
        component="a"
        size={buttonSize}
        variant={buttonVariant}
        href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={theme => ({
          backgroundColor: '#4267B2',
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.fn.lighten('#4267B2', 0.5)
          }
        })}
      >
        Facebook
      </Button>

      <Button
        component="a"
        size={buttonSize}
        variant={buttonVariant}
        href={`https://twitter.com/share?text=${shareTitle}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={theme => ({
          backgroundColor: '#1DA1F2',
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.fn.lighten('#1DA1F2', 0.5)
          }
        })}
      >
        Twitter
      </Button>

      <Button
        component="a"
        size={buttonSize}
        variant={buttonVariant}
        href={`https://linkedin.com/shareArticle?mini=true&source=MCL&title=${shareTitle}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={theme => ({
          backgroundColor: '#0077B5',
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.fn.lighten('#0077B5', 0.5)
          }
        })}
      >
        LinkedIn
      </Button>

      <Button
        size={buttonSize}
        variant={buttonVariant}
        onClick={() => clipboard.copy(urlValue)}
      >
        Share Link
      </Button>

      <Button
        component="a"
        size={buttonSize}
        variant={buttonVariant}
        href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        color="red"
      >
        Email
      </Button>
    </Group>
  )
}

export default ShareButtons
