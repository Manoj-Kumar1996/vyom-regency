"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code2,
  Eye,
} from "lucide-react";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={15} />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-300 mx-1" />

      <select
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
            ? "h2"
            : editor.isActive("heading", { level: 3 })
            ? "h3"
            : editor.isActive("heading", { level: 4 })
            ? "h4"
            : "p"
        }
        onChange={(e) => {
          const val = e.target.value;
          if (val === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: Number(val.replace("h", "")) as 1 | 2 | 3 | 4 }).run();
        }}
        className="text-sm border rounded px-1.5 py-1 bg-white text-gray-700"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      <span className="w-px h-5 bg-gray-300 mx-1" />

      <ToolbarButton title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton title="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton title="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code size={15} />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-300 mx-1" />

      <ToolbarButton title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight size={15} />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-300 mx-1" />

      <ToolbarButton title="Insert Link" active={editor.isActive("link")} onClick={setLink}>
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton title="Insert Image" onClick={addImage}>
        <ImageIcon size={15} />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-300 mx-1" />

      <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={15} />
      </ToolbarButton>
    </div>
  );
}

export default function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [codeValue, setCodeValue] = useState(value || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Start writing…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setCodeValue(html);
    },
    editorProps: {
      attributes: {
        class: "min-h-[180px] p-4 text-sm leading-6 text-gray-700 focus:outline-none prose prose-sm max-w-none",
      },
    },
  });

  // Keep the editor in sync if `value` changes externally (e.g. loading a different record)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    setCodeValue(value || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const switchToCode = () => {
    if (editor) setCodeValue(editor.getHTML());
    setMode("code");
  };

  const switchToVisual = () => {
    if (editor) editor.commands.setContent(codeValue || "", { emitUpdate: false });
    onChange(codeValue);
    setMode("visual");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50">
        {mode === "visual" ? <Toolbar editor={editor} /> : <div className="p-2 text-xs text-gray-400 px-3">Editing raw HTML</div>}
        <div className="flex items-center gap-1 px-2 shrink-0">
          <button
            type="button"
            onClick={switchToVisual}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition ${
              mode === "visual" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Eye size={13} /> Visual
          </button>
          <button
            type="button"
            onClick={switchToCode}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition ${
              mode === "code" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Code2 size={13} /> Code
          </button>
        </div>
      </div>

      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={codeValue}
          onChange={(e) => {
            setCodeValue(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="w-full min-h-[180px] p-4 text-sm font-mono leading-6 text-gray-700 focus:outline-none resize-y"
        />
      )}
    </div>
  );
}
