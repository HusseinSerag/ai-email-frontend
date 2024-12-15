import { useMutation } from "@tanstack/react-query";
import { useCustomAuth } from "./useCustomAuth";

export default function useGenerateEmail() {
  const { getToken } = useCustomAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      prompt,
      context,
    }: {
      prompt: string;
      context: string;
    }) => {
      try {
        const token = await getToken();

        if (!token) throw new Error("Unauthenticated");

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
          {
            method: "POST",
            body: JSON.stringify({
              context,
              prompt,
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "text/event-stream",
            },
          }
        );

        const reader = response.body
          ?.pipeThrough(new TextDecoderStream())
          .getReader();
        while (true) {
          if (!reader) break;
          const { value, done } = await reader.read();
          if (done) break;
          console.log(value);
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  });

  return {
    generate: mutate,
    isPending,
  };
}
