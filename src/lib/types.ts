export interface Account {
  emailAddress: string
  id: string
  name: string
  isSyncedInitially: isInitialized
}

export enum isInitialized {
  start = 'start',
  complete = 'complete',
}

export interface EmailParticipant {
  id: string
  name?: string
  address: string
  raw: string | null
  accountId: string
}

export interface Email {
  from: EmailParticipant
  body: string
  bodySnippet: string
  emailLabel: 'inbox' | 'sent' | 'draft' // Adjust if there are more labels
  subject: string
  sentAt: string // ISO date string
  id: string
  sysLabels: Array<
    | 'junk'
    | 'trash'
    | 'sent'
    | 'inbox'
    | 'unread'
    | 'flagged'
    | 'important'
    | 'draft'
  >
  to: EmailParticipant[]
  cc: EmailParticipant[]
  replyTo: EmailParticipant[]
  attachments: EmailAttachment[]
}

export interface EmailAttachment {
  id: string
  name: string
  mimeType: string
  size: number
  inline: boolean
  contentId?: string
  content?: string
  contentLocation?: string
}

export interface EmailThread {
  id: string
  subject: string
  lastMessageDate: string // ISO date string
  participantIds: string[]
  accountId: string
  done: boolean
  inboxStatus: boolean
  draftStatus: boolean
  sentStatus: boolean
  starred: boolean
  archived: boolean
  emails: Email[]
}

export type EmailThreadArray = EmailThread[]

export interface ReplyToInformation {
  subject: string
  to: EmailParticipant[]
  cc: EmailParticipant[]
  id: string
  from: { name: string, address: string }
  references: string
}

export interface SendEmailData {
  body: string
  subject: string
  threadId?: string
  to: { name: string, address: string }[]
  from: { name: string, address: string }
  references?: string
  inReplyTo?: string
  cc?: { name: string, address: string }[] | undefined
  bcc?: { name: string, address: string }[] | undefined
  replyTo?: { name: string, address: string }[] | undefined
  files?: File[]
}
