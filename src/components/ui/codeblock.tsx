import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import CodeEditor from "@uiw/react-textarea-code-editor";

export interface CodeBlockProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  language?: string;
  darkMode?: boolean;
}

const CodeBlock = React.forwardRef<HTMLTextAreaElement, CodeBlockProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          `relative flex min-h-[80px] w-full rounded border-input px-3 py-2 text-sm`,
          className,
        )}
        style={{ backgroundColor: props.darkMode ? "#888888" : "#ffffff" }}
      >
        <CodeEditor
          padding={0}
          data-color-mode={props.darkMode ? "dark" : "light"}
          style={{
            backgroundColor: props.darkMode ? "#888888" : "#ffffff",
            width: "100%",
            fontFamily: "ui-monospace,Geist Mono",
          }}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
