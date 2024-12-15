// /thread/:id/:threadId
import { useCustomAuth } from "@/hooks/useCustomAuth";

import { useQuery } from "@tanstack/react-query";

import { createAxiosClient } from "../axios";
import { ReplyToInformation } from "@/lib/types";
import { useMail } from "@/hooks/useMail";

export default function useReplyToInfo() {
  const { userId, getToken } = useCustomAuth();
  const { chosenAccount, threadId } = useMail();

  const accountId = chosenAccount?.id;
  const { data: details, isPending: isLoadingDetails } = useQuery({
    queryKey: ["threads", userId, accountId, threadId],

    queryFn: async function () {
      try {
        if (!accountId || !threadId || !userId) {
          throw new Error("No account ID");
        }
        const token = await getToken();

        const res = await createAxiosClient(token!).get<{
          data: ReplyToInformation;
        }>(`/api/accounts/thread/${accountId}/${threadId}`, {});

        return res.data.data;
      } catch (e) {
        return null;
      }
    },
  });

  return {
    details,
    isLoadingDetails,
  };
}
