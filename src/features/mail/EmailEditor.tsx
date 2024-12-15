import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import { useState } from "react";
import EditorMenuBar from "./EditorMenuBar";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import SelectInput from "./ToInput";
import { useMail } from "@/hooks/useMail";
import { Input } from "@/components/ui/input";
import AiComposeButton from "./ai-composeButton";

import { useCustomAuth } from "@/hooks/useCustomAuth";
import { generateEmail } from "@/api/generateAi";
import { turndown } from "@/lib/turndown";
import { useToast } from "@/hooks/use-toast";
import { Bot, X } from "lucide-react";
import { useFiles } from "@/hooks/useFiles";

interface EmailEditorProps {
  subject: string;
  setSubject: (value: string) => void;
  toValue: {
    label: string;
    value: string;
  }[];
  setToValue(
    value: {
      label: string;
      value: string;
    }[]
  ): void;

  ccValue: {
    label: string;
    value: string;
  }[];
  setCCValue(
    value: {
      label: string;
      value: string;
    }[]
  ): void;

  to: string[];
  handleSend: (value: string, file: File[]) => Promise<void>;
  isSending: boolean;
  defaultToolBarExpanded: boolean;
  takeThread?: boolean;
}
export default function EmailEditor({
  ccValue,
  setCCValue,
  setSubject,
  setToValue,
  subject,
  toValue,
  defaultToolBarExpanded,
  handleSend,
  isSending,
  to,
  takeThread = true,
}: EmailEditorProps) {
  const [value, setValue] = useState("");

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "alt-j": () => {
          onGenerate(this.editor.getText());
          return true;
        },
      };
    },
  });
  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    onUpdate({ editor }) {
      setValue(editor?.getHTML());
    },
  });
  const [expanded, setExpanded] = useState(defaultToolBarExpanded);
  const { threads, threadId, chosenAccount } = useMail();
  const { getToken } = useCustomAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addFile, files, removeFile } = useFiles();
  async function onGenerate(prompt: string) {
    const thread = threads?.find((thread) => thread.id === threadId);

    let context = "";
    if (thread && takeThread) {
      for (const email of thread?.emails) {
        context += `
        subject: ${email.subject}
        From: ${email.from.name}
        from email: ${email.from.address}
        Sent: ${new Date(email.sentAt).toLocaleString()}
        Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
        `;
      }
    }
    context += `
    My name is ${chosenAccount?.name} and my email is ${chosenAccount?.emailAddress}`;

    try {
      setIsLoading(true);

      const response = await generateEmail(
        {
          context,
          prompt,
        },
        getToken
      );
      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      setIsLoading(false);
      while (true) {
        if (!reader) break;
        const { value: newChunk, done } = await reader.read();
        if (done) break;

        editor?.commands.insertContent(newChunk);
      }
    } catch (e) {
      toast({
        title: "Error getting response!",
      });
      setIsLoading(false);
    }
  }

  if (editor)
    return (
      <div>
        <div className="flex p-4 py-2 border-b">
          <EditorMenuBar addFile={addFile} editor={editor} />
        </div>
        <div className="p-4 pb-0 space-y-2">
          {expanded && (
            <div className="flex flex-col gap-1">
              <SelectInput
                label="To"
                onChange={setToValue}
                placeholder="Add Recipients"
                //@ts-ignore
                value={toValue}
              />
              <SelectInput
                label="CC"
                onChange={setCCValue}
                placeholder="Add Recipients"
                //@ts-ignore
                value={ccValue}
              />
              <Input
                id="subject"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className="cursor-pointer"
              onClick={() => setExpanded((t) => !t)}
            >
              <span className="text-green-600 font-medium">Draft </span>
              {to.length > 0 && <span>to {to.join(", ")}</span>}
            </div>
            <AiComposeButton
              isComposing={defaultToolBarExpanded}
              onGenerate={onGenerate}
            />
          </div>
        </div>
        <div className="prose max-h-[200px] overflow-y-auto w-full px-4">
          {!isLoading ? (
            <EditorContent
              editor={editor}
              value={value}
              placeholder="Write your email here..."
              className="!w-full  dark:!text-white"
            />
          ) : (
            <div className="flex w-full justify-center py-3">
              <Bot className="animate-fastRotatePause" />
            </div>
          )}
        </div>
        {files.length > 0 && (
          <div className="px-1 py-1 gap-1 flex flex-col">
            {files.map((file) => {
              return (
                <div className="text-[12px] px-1 cursor-pointer flex justify-between gap-4 py-1.5 bg-gray-200">
                  <div
                    onClick={() => {
                      const url = URL.createObjectURL(file);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = file.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="font-semibold hover:underline flex-1"
                  >
                    {file.name.length > 30
                      ? `${file.name.slice(0, 30)}...`
                      : file.name}
                  </div>

                  <button onClick={() => removeFile(file.name)}>
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <Separator />
        <div className="py-3 px-4 flex items-center justify-between">
          <span className="text-sm">
            Tip: Press{" "}
            <kbd className="text-gray-800 font-semibold text-xs bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5">
              alt + J
            </kbd>{" "}
            for AI autocomplete
          </span>
          <Button
            onClick={async () => {
              editor.commands.clearContent();
              await handleSend(value, files);
            }}
            disabled={isSending || isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    );
  return null;
}
