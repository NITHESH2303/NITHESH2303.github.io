"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type VSCodeStyleCodeViewProps = {
  value: string;
  language?: string;
  className?: string;
};

/** Infers Monaco language from file extension in the raw URL. */
export function getLanguageFromPathOrLang(githubRawUrl?: string | null): string {
  if (!githubRawUrl) return "plaintext";
  const ext = githubRawUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
  const map: Record<string, string> = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    tsx: "typescript",
    jsx: "javascript",
    java: "java",
    go: "go",
    rs: "rust",
    rb: "ruby",
    php: "php",
    cs: "csharp",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    sql: "sql",
    sh: "shell",
    yaml: "yaml",
    yml: "yaml",
  };
  return map[ext ?? ""] ?? "plaintext";
}

export default function VSCodeStyleCodeView({ value, language = "plaintext", className }: VSCodeStyleCodeViewProps) {
  return (
    <div className={className} style={{ height: "100%", minHeight: 320 }}>
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          folding: true,
          lineNumbersMinChars: 3,
          fontSize: 13,
          fontFamily: "var(--font-mono, 'Menlo', 'Monaco', 'Consolas', monospace)",
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "line",
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
        loading={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 320,
              background: "#1e1e1e",
              color: "#858585",
              fontSize: 13,
            }}
          >
            Loading editor…
          </div>
        }
      />
    </div>
  );
}
