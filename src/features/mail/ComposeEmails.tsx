"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import EmailEditor from "./EmailEditor";
import { useEmailEditorStates } from "@/hooks/useEmailEditorStates";
import { useState } from "react";
import useSendEmail from "@/api/account/useSendEmail";
import { useMail } from "@/hooks/useMail";
import { toast } from "@/hooks/use-toast";
import { createEmailFormData } from "@/lib/utils";

export function ComposeEmail() {
  const {
    ccValue,

    setCCValue,
    setSubject,
    setToValue,
    subject,
    toValue,
  } = useEmailEditorStates();
  const { isSendingEmail, sendEmail } = useSendEmail();
  const { chosenAccount } = useMail();
  const [open, setOpen] = useState(false);
  async function handleSend(value: string, files: File[]) {
    if (!chosenAccount) return;
    if (toValue.length == 0) {
      toast({
        title: "Please send an email to someone!",
      });
      return;
    }

    sendEmail(
      createEmailFormData({
        body: value,
        from: {
          address: chosenAccount.emailAddress,
          name: chosenAccount.name ?? "",
        },
        to: toValue.map((to) => ({
          address: to.value,
          name: to.value,
        })),
        cc: ccValue.map((cc) => ({
          address: cc.value,
          name: cc.value,
        })),
        subject,
        replyTo: [
          {
            address: chosenAccount.emailAddress,
            name: chosenAccount.name ?? "",
          },
        ],
        inReplyTo: undefined,
        files,
      }),
      {
        onSuccess() {
          setOpen(false);
        },
      }
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => setOpen(true)}>Compose</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[50%]">
        <div className="mx-auto max-h-full overflow-y-auto  w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle>Compose Email</DrawerTitle>
          </DrawerHeader>
          <EmailEditor
            subject={subject}
            setSubject={setSubject}
            toValue={toValue}
            ccValue={ccValue}
            to={toValue.map((to) => to.value)}
            defaultToolBarExpanded={false}
            setCCValue={setCCValue}
            setToValue={setToValue}
            handleSend={handleSend}
            isSending={isSendingEmail}
            takeThread={false}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
