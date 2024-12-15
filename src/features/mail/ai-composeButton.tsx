import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface AiComposeButtonProps {
  isComposing: boolean;
  onGenerate(token: string): Promise<void>;
}
export default function AiComposeButton({ onGenerate }: AiComposeButtonProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} size={"icon"} variant={"outline"}>
          <Bot className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Smart Compose</DialogTitle>
          <DialogDescription>
            AI will help you compose your email.
          </DialogDescription>

          <Textarea
            className="my-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
          />
          <Button
            onClick={() => {
              onGenerate(prompt);
              setOpen(false);
              setPrompt("");
            }}
          >
            Generate
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
