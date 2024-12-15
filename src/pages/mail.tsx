import { LoadingSpinner } from "@/components/ui/spinner";
import { useMail } from "@/hooks/useMail";
import MailDashboard from "@/features/mail/MailDashboard";

export default function Mail() {
  const { isLoading } = useMail();
  if (isLoading)
    return (
      <LoadingSpinner outerClassName="h-full w-full flex items-center justify-center" />
    );
  return <MailDashboard defaultLayout={[20, 32, 48]} navCollapsedSize={4} />;
}
