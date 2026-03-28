import React from "react";

/**
 * FileUploadBadge
 * Shown above the InputBar when a file is active.
 * Displays the file name, current indexing status, and a clear button.
 *
 * @param {{ fileName: string, status: string, onClear: function }} props
 */

const STATUS_CONFIG = {
  uploading: {
    label: "Uploading file...",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    pulse: true,
  },
  parsing: {
    label: "Reading document...",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    pulse: true,
  },
  embedding: {
    label: "Analyzing content...",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    pulse: true,
  },
  indexing: {
    label: "Indexing document...",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10 border-indigo-400/20",
    pulse: true,
  },
  ready: {
    label: "Ready to chat",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    pulse: false,
  },
  failed: {
    label: "Upload failed",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    pulse: false,
  },
};

const FileUploadBadge = ({ fileName, status = "ready", onClear, errorMessage }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const isProcessing = config.pulse;

  return (
    <div
      className={`mx-auto w-[90%] max-w-[1200px] mb-1.5 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-300 ${config.bg}`}
    >
      {/* Animated status dot */}
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isProcessing
            ? `${config.color.replace("text-", "bg-")} animate-pulse`
            : status === "ready"
            ? "bg-green-400"
            : "bg-red-400"
        }`}
      />

      {/* File icon + name */}
      <span className="material-symbols-outlined text-sm text-muted-foreground">
        description
      </span>
      <span className="text-foreground truncate max-w-[180px] sm:max-w-xs">
        {fileName}
      </span>

      {/* Status label */}
      <span className={`${config.color} shrink-0`}>
        · {errorMessage && status === "failed" ? errorMessage : config.label}
      </span>

      {/* Clear button — only visible when not actively processing */}
      {!isProcessing && (
        <button
          onClick={onClear}
          title="Remove file"
          className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 hover:bg-surface"
        >
          <span className="material-symbols-outlined text-sm leading-none">close</span>
        </button>
      )}
    </div>
  );
};

export default FileUploadBadge;
