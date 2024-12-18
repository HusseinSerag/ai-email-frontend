import type { SendEmailData } from '@/lib/types'

export function createEmailFormData(emailData: SendEmailData): FormData {
  const {
    body,
    from,
    to,
    cc,
    subject,
    replyTo,
    inReplyTo,
    files,
    references,
    threadId,
  } = emailData
  const formData = new FormData()

  // Add plain fields
  formData.append('body', body)
  formData.append('from', JSON.stringify(from))
  formData.append('to', JSON.stringify(to))
  if (cc)
    formData.append('cc', JSON.stringify(cc))
  formData.append('subject', subject)
  if (replyTo)
    formData.append('replyTo', JSON.stringify(replyTo))
  if (inReplyTo)
    formData.append('inReplyTo', inReplyTo) // Handle undefined inReplyTo
  if (references)
    formData.append('references', references)
  if (threadId)
    formData.append('threadId', threadId)
  // Add files
  if (files) {
    files.forEach((file) => {
      formData.append(`attachments`, file, file.name) // Use file.name as the filename
    })
  }

  return formData
}
