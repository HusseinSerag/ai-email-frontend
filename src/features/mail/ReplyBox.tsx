import useReplyToInfo from "@/api/account/useReplyToThread";
import EmailEditor from "./EmailEditor";
import { ReplyToInformation } from "@/lib/types";

import { useMail } from "@/hooks/useMail";
import { useEmailEditorStates } from "@/hooks/useEmailEditorStates";
import useSendEmail from "@/api/account/useSendEmail";
import { toast } from "@/hooks/use-toast";
import { createEmailFormData } from "@/lib/utils";

export default function ReplyBox() {
  const { details } = useReplyToInfo();

  return <Component key={details?.id ?? ""} details={details} />;
}

function Component({
  details,
}: {
  details: ReplyToInformation | undefined | null;
}) {
  const { isSendingEmail, sendEmail } = useSendEmail();
  const { threadId } = useMail();
  const { ccValue, setCCValue, setSubject, setToValue, subject, toValue } =
    useEmailEditorStates(details);
  async function handleSend(value: string, file: File[]) {
    if (!details) return;
    if (toValue.length == 0) {
      toast({
        title: "Please send an email to someone!",
      });
      return;
    }

    sendEmail(
      createEmailFormData({
        body: value,
        subject: subject,
        threadId: threadId ?? undefined,
        from: details.from,
        to: details.to.map((to) => ({
          address: to.address,
          name: to.name ?? "",
        })),
        cc: details.cc.map((cc) => ({
          address: cc.address,
          name: cc.name ?? "",
        })),
        inReplyTo: details.id,
        files: file,
      })
    );
  }
  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      toValue={toValue}
      ccValue={ccValue}
      to={details?.to.map((to) => to.address) ?? []}
      defaultToolBarExpanded={false}
      setCCValue={setCCValue}
      setToValue={setToValue}
      handleSend={handleSend}
      isSending={isSendingEmail}
    />
  );
}
