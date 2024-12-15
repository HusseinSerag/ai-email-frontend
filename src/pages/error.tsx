import { useToast } from "@/hooks/use-toast";
import { Navigate, useSearchParams } from "react-router-dom";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const { toast } = useToast();
  toast({
    title: "Uh oh! Something went wrong!",
    description: message ? message : "Please try again later",
  });
  return <Navigate to={"/mail"} />;
}
