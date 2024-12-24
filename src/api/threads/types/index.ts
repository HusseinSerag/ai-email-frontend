import type { Email } from '@/lib/types'

export interface SearchThread {
  body: string
  from: string
  sentAt: string
  subject: string
  id: string
  to: string[]
  rawBody: string
  emails: Pick<Email, 'id' | 'sysLabels'>[]
}
