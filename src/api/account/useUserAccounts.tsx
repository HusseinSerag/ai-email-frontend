import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useQuery } from "@tanstack/react-query";
import { createAxiosClient } from "../axios";
import { Account } from "@/lib/types";

export default function useUserAccounts() {
  const { userId, getToken } = useCustomAuth();
  const { data: accounts, isPending: isPendingAccounts } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async function () {
      try {
        if (!userId) throw new Error("No userId");
        const token = await getToken();

        const res = await createAxiosClient(token!).get<{
          data: Account[];
        }>("/api/accounts/user");

        return res.data.data;
      } catch (e) {
        return null;
      }
    },
  });
  return {
    accounts,
    isPendingAccounts,
  };
}
