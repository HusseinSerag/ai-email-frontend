import type { ReplyToInformation } from '@/lib/types'
import useSendEmail from '@/api/mail/useSendEmail'
import useReplyToInfo from '@/api/threads/useReplyToInfoThread'

import { useEmailEditorStates } from '@/features/mail/hooks/useEmailEditorStates'
import { toast } from '@/hooks/use-toast'
import { useMail } from '@/hooks/useMail'

import { createEmailFormData } from '../utils/createFormDataEmail'
import EmailEditor from './EmailEditor'

interface ReplyBoxProps {
  isEditorOpened?: boolean
}
export default function ReplyBox({ isEditorOpened }: ReplyBoxProps) {
  const { details } = useReplyToInfo()

  return (
    <Component
      isEditorOpened={isEditorOpened}
      key={details?.id ?? ''}
      details={details}
    />
  )
}

function Component({
  details,
  isEditorOpened,
}: {
  details: ReplyToInformation | undefined | null
  isEditorOpened?: boolean
}) {
  const { isSendingEmail, sendEmail } = useSendEmail()
  const { threadId } = useMail()
  const { ccValue, setCCValue, setSubject, setToValue, subject, toValue }
    = useEmailEditorStates(details)
  async function handleSend(value: string, file: File[]) {
    if (!details)
      return
    if (toValue.length === 0) {
      toast({
        title: 'Please send an email to someone!',
      })
      return
    }

    const references = details.references
      ? `${details.references} ${details.id}`
      : details.id

    sendEmail(
      createEmailFormData({
        body: value,
        subject,
        threadId: threadId ?? undefined,
        from: details.from,
        to: details.to.map(to => ({
          address: to.address,
          name: to.name ?? '',
        })),
        cc: details.cc.map(cc => ({
          address: cc.address,
          name: cc.name ?? '',
        })),
        inReplyTo: details.id,
        files: file,
        replyTo: [details.from],
        references,
      }),
    )
  }
  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      toValue={toValue}
      ccValue={ccValue}
      to={details?.to.map(to => to.address) ?? []}
      defaultToolBarExpanded={false}
      setCCValue={setCCValue}
      setToValue={setToValue}
      handleSend={handleSend}
      isSending={isSendingEmail}
      isEditorOpened={isEditorOpened}
    />
  )
}
