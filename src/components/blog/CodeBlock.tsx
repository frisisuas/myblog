import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Check, Copy, Terminal } from "lucide-react";

const LANG_COLORS: Record<string, string> = {
  typescript: "text-blue-400",
  tsx: "text-blue-400",
  javascript: "text-yellow-400",
  jsx: "text-yellow-400",
  css: "text-pink-400",
  html: "text-orange-400",
  bash: "text-green-400",
  json: "text-amber-400",
};

const customTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "#e2e8f0",
    background: "transparent",
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
    fontSize: "0.875rem",
    lineHeight: "1.7",
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: "#e2e8f0",
    background: "transparent",
    padding: 0,
    margin: 0,
    overflow: "auto",
  },
  comment: { color: "#64748b", fontStyle: "italic" },
  prolog: { color: "#64748b" },
  doctype: { color: "#64748b" },
  cdata: { color: "#64748b" },
  punctuation: { color: "#94a3b8" },
  property: { color: "#93c5fd" },
  tag: { color: "#f97316" },
  boolean: { color: "#fb923c" },
  number: { color: "#fb923c" },
  constant: { color: "#fb923c" },
  symbol: { color: "#fb923c" },
  deleted: { color: "#f87171" },
  selector: { color: "#86efac" },
  "attr-name": { color: "#93c5fd" },
  string: { color: "#86efac" },
  char: { color: "#86efac" },
  builtin: { color: "#86efac" },
  inserted: { color: "#86efac" },
  operator: { color: "#cbd5e1" },
  entity: { color: "#e2e8f0" },
  url: { color: "#86efac" },
  variable: { color: "#e2e8f0" },
  atrule: { color: "#f97316" },
  "attr-value": { color: "#86efac" },
  keyword: { color: "#c084fc" },
  function: { color: "#60a5fa" },
  "class-name": { color: "#f97316" },
  regex: { color: "#86efac" },
  important: { color: "#f97316", fontWeight: "bold" },
};

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabel = language.toUpperCase();
  const langColor = LANG_COLORS[language] ?? "text-muted-foreground";

  return (
    <div
      className="rounded-xl overflow-hidden border border-white/8 my-8"
      style={{ background: "hsl(240 10% 6%)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/8"
        style={{ background: "hsl(240 10% 8%)" }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {filename ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Terminal className="w-3 h-3" />
              {filename}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono font-semibold ${langColor}`}>
            {langLabel}
          </span>
          <button
            onClick={handleCopy}
            data-testid="button-copy-code"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="p-5 overflow-x-auto">
        <SyntaxHighlighter
          language={language === "tsx" ? "tsx" : language}
          style={customTheme}
          showLineNumbers
          lineNumberStyle={{
            color: "hsl(240 5% 35%)",
            fontSize: "0.75rem",
            paddingRight: "1.5rem",
            minWidth: "2.5rem",
            userSelect: "none",
          }}
          wrapLines={false}
          customStyle={{ margin: 0, padding: 0, background: "transparent" }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
