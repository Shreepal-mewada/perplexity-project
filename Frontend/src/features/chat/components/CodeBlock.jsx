import { useState } from "react";

const extractText = (node) => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return "";
};

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const text = extractText(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      fallbackCopy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  return (
    <div className="code-block-wrapper group">
      <div className="code-block-header">
        {language && (
          <span className="code-block-language">{language}</span>
        )}
        <button
          onClick={handleCopy}
          className={`code-block-copy${copied ? " copied" : ""}`}
          aria-label={copied ? "Copied!" : "Copy code"}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
              <span className="code-block-copy-text">Copied!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">
                content_copy
              </span>
              <span className="code-block-copy-text">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
