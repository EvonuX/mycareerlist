import Document, { DocumentContext, Html } from 'next/document'
import { ServerStyles, createStylesServer } from '@mantine/next'

const stylesServer = createStylesServer()

// @ts-ignore
export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <Html lang="en">
          {initialProps.styles}
          <ServerStyles html={initialProps.html} server={stylesServer} />
        </Html>
      )
    }
  }
}
