import type { Editor } from '@tiptap/react'
import type { ComponentProps, ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bold,
  Code,
  EllipsisVertical,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { useRef, useState } from 'react'

interface MenuItem {
  icon: ReactNode
  text: string
}
interface MenuItemInput extends MenuItem {
  props: ComponentProps<'input'>
  type: 'input'
}
interface MenuItemButton extends MenuItem {
  props: ComponentProps<'button'>
  type: 'button'
}

function TipTapMenuBar({
  editor,
  addFile,
}: {
  editor: Editor
  addFile: (file: File) => void
}) {
  const [menuItems] = useState<(MenuItemInput | MenuItemButton)[]>(() => {
    return [
      {
        icon: <Bold className="size-4 text-secondary-foreground" />,
        text: 'Bold',
        props: {
          onClick: () => editor.chain().focus().toggleBold().run(),
          disabled: !editor.can().chain().focus().toggleBold().run(),
          className: editor.isActive('bold') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Italic className="size-4 text-secondary-foreground" />,
        text: 'Italic',
        props: {
          onClick: () => editor.chain().focus().toggleItalic().run(),
          disabled: !editor.can().chain().focus().toggleItalic().run(),
          className: editor.isActive('italic') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Strikethrough className="size-4 text-secondary-foreground" />,
        text: 'Strikethrough',
        props: {
          onClick: () => editor.chain().focus().toggleStrike().run(),
          disabled: !editor.can().chain().focus().toggleStrike().run(),
          className: editor.isActive('strike') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Code className="size-4 text-secondary-foreground" />,
        text: 'Code',
        props: {
          onClick: () => editor.chain().focus().toggleCode().run(),
          disabled: !editor.can().chain().focus().toggleCode().run(),
          className: editor.isActive('code') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Heading1 className="size-4 text-secondary-foreground" />,
        text: 'Heading 1',
        props: {
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          className: editor.isActive('heading', { level: 1 })
            ? 'is-active'
            : '',
        },
        type: 'button',
      },
      {
        icon: <Heading2 className="size-4 text-secondary-foreground" />,
        text: 'Heading 2',
        props: {
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          className: editor.isActive('heading', { level: 2 })
            ? 'is-active'
            : '',
        },
        type: 'button',
      },

      {
        icon: <Heading3 className="size-4 text-secondary-foreground" />,
        text: 'Heading 3',
        props: {
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          className: editor.isActive('heading', { level: 3 })
            ? 'is-active'
            : '',
        },
        type: 'button',
      },

      {
        icon: <Heading4 className="size-4 text-secondary-foreground" />,
        text: 'Heading 4',
        props: {
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          className: editor.isActive('heading', { level: 4 })
            ? 'is-active'
            : '',
        },
        type: 'button',
      },

      {
        icon: <Heading5 className="size-4 text-secondary-foreground" />,
        text: 'Heading 5',
        props: {
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 5 }).run(),
          className: editor.isActive('heading', { level: 5 })
            ? 'is-active'
            : '',
        },
        type: 'button',
      },

      {
        icon: <List className="size-4 text-secondary-foreground" />,
        text: 'Bullet List',
        props: {
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          className: editor.isActive('bulletList') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <ListOrdered className="size-4 text-secondary-foreground" />,
        text: 'Ordered List',
        props: {
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          className: editor.isActive('orderedList') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Quote className="size-4 text-secondary-foreground" />,
        text: 'Blockquote',
        props: {
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          className: editor.isActive('blockquote') ? 'is-active' : '',
        },
        type: 'button',
      },
      {
        icon: <Undo className="size-4 text-secondary-foreground" />,
        text: 'Undo',
        props: {
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().chain().focus().undo().run(),
        },
        type: 'button',
      },
      {
        icon: <Redo className="size-4 text-secondary-foreground" />,
        text: 'Redo',
        props: {
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().chain().focus().redo().run(),
        },
        type: 'button',
      },
      {
        icon: <Paperclip className="size-4 text-secondary-foreground" />,
        text: 'Attach File',
        props: {
          multiple: true,
          type: 'file',
          className: 'hidden',
          onChange: handleFileChange,
        },
        type: 'input',
      },
    ]
  })

  const [collapsedItems] = useState<(MenuItemInput | MenuItemButton)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files)
      return
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file)
        continue
      addFile(file)
    }
  }

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      {menuItems.map((item, index) =>
        item.type === 'button'
          ? (
              <button key={index} {...item.props}>
                {item.icon}
              </button>
            )
          : (
              <label key={index} className="cursor-pointer flex items-center">
                <input {...item.props} />
                {item.icon}
              </label>
            ),
      )}

      {collapsedItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="size-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {collapsedItems.map(item => (
              <DropdownMenuItem>
                <div className="grid items-center content-center w-full grid-cols-3 gap-1">
                  <div className="col-span-1">{item.icon}</div>
                  <div className="col-span-2 font-semibold text-xs ">
                    {item.type === 'button'
                      ? (
                          <button {...item.props}>{item.text}</button>
                        )
                      : (
                          <label className="cursor-pointer">
                            {item.text}
                            <input {...item.props} />
                          </label>
                        )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default TipTapMenuBar
