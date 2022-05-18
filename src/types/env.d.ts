declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string

    NEXT_PUBLIC_BASE_URL: string

    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string

    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string

    FACEBOOK_CLIENT_ID: string
    FACEBOOK_SECRET: string

    EMAIL_FROM: string
    EMAIL_SERVER_PORT: number
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_USER: string
    EMAIL_SERVER_PASSWORD: string

    NEXT_PUBLIC_PAYPAL_CLIENT_ID: string
    PAYPAL_CLIENT_ID: string
    PAYPAL_APP_SECRET: string

    TWITTER_APP_KEY: string
    TWITTER_APP_SECRET: string
    TWITTER_ACCESS_TOKEN: string
    TWITTER_ACCESS_SECRET: string

    PLAUSIBLE_API_KEY: string

    SLACK_APP_TOKEN: string
  }
}
