import { File, Inbox, Send } from "lucide-react";
import { Nav } from "./nav";
import { useLocalStorage } from "usehooks-ts";
import { chosenTab } from "@/lib/globals";
import { useMail } from "@/hooks/useMail";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [tab] = useLocalStorage<"inbox" | "draft" | "sent">(chosenTab, "inbox");
  const { count } = useMail();

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          label: count?.inbox.toString(),
          icon: Inbox,
          title: "Inbox",
          variant: tab === "inbox" ? "default" : "ghost",
        },
        {
          title: "Draft",
          label: count?.draft.toString(),
          icon: File,
          variant: tab === "draft" ? "default" : "ghost",
        },
        {
          title: "Sent",
          label: count?.sent.toString(),
          icon: Send,
          variant: tab === "sent" ? "default" : "ghost",
        },
      ]}
    />
  );
}
