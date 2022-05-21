import emailClient from './sendgrid'

export default async function sendVerificationRequest({
  identifier,
  url
}: {
  identifier: string
  url: string
}) {
  try {
    await emailClient.send({
      to: identifier,
      from: 'noreply@mcl.com',
      templateId: 'd-70c057ce34dc48e883f6fd5fed3eaf66',
      dynamicTemplateData: {
        url
      }
    })
  } catch (err) {
    console.error(err)
  }
}
