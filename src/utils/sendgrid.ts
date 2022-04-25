import emailClient from '@sendgrid/mail'

emailClient.setApiKey(process.env.EMAIL_SERVER_PASSWORD)

export default emailClient
