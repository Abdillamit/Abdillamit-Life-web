"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders user markdown with dark-theme styling (no typography plugin needed). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-base leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="text-xl font-semibold text-foreground" {...p} />,
          h2: (p) => <h2 className="text-lg font-semibold text-foreground" {...p} />,
          h3: (p) => <h3 className="text-base font-semibold text-foreground" {...p} />,
          p: (p) => <p className="whitespace-pre-wrap" {...p} />,
          ul: (p) => <ul className="list-disc space-y-1 pl-5" {...p} />,
          ol: (p) => <ol className="list-decimal space-y-1 pl-5" {...p} />,
          a: (p) => <a className="text-accent underline" target="_blank" rel="noreferrer" {...p} />,
          code: (p) => (
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm" {...p} />
          ),
          pre: (p) => (
            <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-sm" {...p} />
          ),
          blockquote: (p) => (
            <blockquote className="border-l-2 border-accent pl-3 text-muted" {...p} />
          ),
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          hr: () => <hr className="border-border" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
