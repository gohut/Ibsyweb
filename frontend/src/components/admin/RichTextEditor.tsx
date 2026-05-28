"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

type RichTextEditorProps = {
  initialValue: string;
  onChange?: (value: string) => void;
};

const actions = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Underline", command: "underline" },
  { label: "H2", command: "formatBlock", value: "h2" },
  { label: "Bullet", command: "insertUnorderedList" },
  { label: "Numbered", command: "insertOrderedList" },
];

export function RichTextEditor({ initialValue, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!ref.current || initialized.current) {
      return;
    }

    ref.current.innerHTML = initialValue;
    initialized.current = true;
  }, [initialValue]);

  const emitChange = () => {
    onChange?.(ref.current?.innerHTML ?? "");
  };

  const runCommand = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value);
    emitChange();
  };

  return (
    <div className="editor-shell">
      <div className="editor-toolbar">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand(action.command, action.value);
            }}
          >
            {action.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          onMouseDown={(event) => {
            event.preventDefault();
            const url = window.prompt("Enter URL");
            if (url) {
              runCommand("createLink", url);
            }
          }}
        >
          Link
        </Button>
        <Button
          variant="ghost"
          onMouseDown={(event) => {
            event.preventDefault();
            runCommand("insertHTML", "<code>inline code</code>");
          }}
        >
          Code
        </Button>
      </div>
      <div
        ref={ref}
        className="editor-pane"
        contentEditable
        dir="ltr"
        tabIndex={0}
        suppressContentEditableWarning
        onClick={() => ref.current?.focus()}
        onInput={emitChange}
      />
    </div>
  );
}
