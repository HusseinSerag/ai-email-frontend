import { useMail } from "@/hooks/useMail";
import { Email } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Avatar from "react-avatar";
import { Letter } from "react-letter";
interface DisplayEmailsProps {
  email: Email;
}
export function EmailDisplay({ email }: DisplayEmailsProps) {
  const { chosenAccount } = useMail();
  const isMe = email.from.address == chosenAccount?.emailAddress;

  return (
    <div
      className={cn(
        "border rounded-md p-4 transition-all hover:translate-x-2",
        {
          "border-l-gray-900 border-l-4  dark:border-l-gray-200": isMe,
        }
      )}
    >
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center justify-between gap-2">
          {!isMe && (
            <Avatar
              name={email.from.name ?? email.from.address}
              round
              size="35"
              email={email.from.address}
              textSizeRatio={2}
            />
          )}
          <span className="font-medium">
            {isMe ? "Me" : email.from.address}
          </span>
        </div>
        <p className="text-xs  text-muted-foreground">
          {formatDistanceToNow(email?.sentAt, {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="h-4"></div>
      <Letter html={email.body ?? ""} className=" rounded-md " />

      {email.attachments.length > 0 && (
        <>
          <div className="h-4"></div>
          <div className="flex">
            {email.attachments.map((attachment) => (
              <div
                onClick={() => {
                  const link = document.createElement("a");
                  if (attachment.contentLocation) {
                    link.href = `https://docs.google.com/viewer?url=${attachment.contentLocation}`;
                  } else {
                  }
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="py-1 px-2 bg-gray-200 hover:scale-105 cursor-pointer text-sm"
              >
                {attachment.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
