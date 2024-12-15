import { ReplyToInformation } from "@/lib/types";
import { useState } from "react";

export function useEmailEditorStates(
  details?: ReplyToInformation | undefined | null
) {
  const [subject, setSubject] = useState(
    details
      ? details?.subject.startsWith("Re:")
        ? details.subject
        : `Re: ${details?.subject}`
      : ""
  );

  const [ccValue, setCCValue] = useState(
    details?.cc.map((cc) => ({
      label: cc.address,
      value: cc.address,
    })) ?? []
  );
  const [toValue, setToValue] = useState(
    details?.to.map((to) => ({
      label: to.address,
      value: to.address,
    })) ?? []
  );

  return {
    ccValue,
    setCCValue,
    toValue,

    setToValue,
    setSubject,
    subject,
  };
}
