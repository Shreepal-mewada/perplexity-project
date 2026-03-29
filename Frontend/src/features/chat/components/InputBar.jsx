import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

/**
 * InputBar — ChatGPT-style file + image + message send.
 *
 * Attach button accepts both PDFs and images.
 * If an image is staged → shows thumbnail preview.
 * If a PDF is staged → shows icon + name badge.
 * Routing (PDF vs image) is handled by Dashboard.handleSend via file.type.
 */
const InputBar = ({
  onSend, // ({ message: string, file: File|null }) => Promise<boolean>
  onClearFile, // () => void — clears the Redux fileContext active session pill
  disabled = false,
  isLoading = false,
}) => {
  const [input, setInput] = useState("");
  const [pendingFile, setPendingFile] = useState(null); // file staged, not yet sent
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // local blob URL for thumbnail
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const { fileContext } = useSelector((state) => state.chat);

  const isFileProcessing =
    fileContext &&
    ["uploading", "parsing", "embedding", "indexing"].includes(
      fileContext.status,
    );

  const isImage = pendingFile?.type?.startsWith("image/");

  // Can send if: has text OR has pending file, and not busy
  const canSend =
    (input.trim() || pendingFile) &&
    !disabled &&
    !isLoading &&
    !isSending &&
    !isFileProcessing;

  const handleSend = async () => {
    if (!canSend) return;

    const messageToSend = input.trim();
    const fileToSend = pendingFile;

    setIsSending(true);
    try {
      const success = await onSend({
        message: messageToSend,
        file: fileToSend,
      });
      if (success) {
        // Clear file state and text *only* after successful send
        setPendingFile(null);
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
        setInput("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    if (
      !disabled &&
      !isLoading &&
      !isSending &&
      !pendingFile &&
      !isFileProcessing
    ) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
      } else {
        setImagePreviewUrl(null);
      }
    }
    // Reset so same file can be re-selected later
    e.target.value = "";
  };

  const handleClearPendingFile = () => {
    setPendingFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getPlaceholder = () => {
    if (isFileProcessing) return "Uploading file, please wait...";
    if (fileContext?.status === "ready")
      return `Ask about ${fileContext.fileName}...`;
    if (pendingFile && isImage)
      return `Ask about this image (or send as-is)...`;
    if (pendingFile) return `Ask about ${pendingFile.name} (or send as-is)...`;
    return "Ask anything...";
  };

  return (
    <div className="w-full px-2 md:px-6 py-2 backdrop-blur-xl shrink-0 bg-background/80">
      {/* Hidden file input — PDF + Images */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── Pending File Preview ── */}
      {pendingFile &&
        (isImage ? (
          /* Image thumbnail preview */
          <div className="mx-auto w-[90%] max-w-[1200px] mb-1.5 flex items-center gap-3 px-3 py-2 rounded-xl border border-secondary/20 bg-secondary/5">
            {/* Thumbnail */}
            <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-white/10">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Info */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {pendingFile.name}
              </span>
              <span className="text-[11px] text-secondary shrink-0">
                {isSending ? "Analyzing image..." : "Image ready to send"}
              </span>
            </div>
            {/* Clear button */}
            {!isSending && (
              <button
                onClick={handleClearPendingFile}
                title="Remove image"
                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 hover:bg-surface"
              >
                <span className="material-symbols-outlined text-sm leading-none">
                  close
                </span>
              </button>
            )}
          </div>
        ) : (
          /* PDF badge preview */
          <div className="mx-auto w-[90%] max-w-[1200px] mb-1.5 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-xs font-medium">
            <span className="w-2 h-2 rounded-full shrink-0 bg-primary" />
            <span className="material-symbols-outlined text-sm text-muted-foreground">
              description
            </span>
            <span className="text-foreground truncate max-w-[180px] sm:max-w-xs">
              {pendingFile.name}
            </span>
            <span className="text-primary shrink-0">
              {isSending ? "Sending..." : "Ready to send"}
            </span>
            {!isSending && (
              <button
                onClick={handleClearPendingFile}
                title="Remove file"
                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 hover:bg-surface"
              >
                <span className="material-symbols-outlined text-sm leading-none">
                  close
                </span>
              </button>
            )}
          </div>
        ))}

      <div className="mx-auto w-[90%] max-w-[1200px]">
        <div className="rounded-full glass p-1.5 md:p-2 premium-shadow ring-1 ring-glass-border">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Attach File Button */}
            <button
              className={`h-8 md:h-9 w-8 md:w-9 rounded-xl p-1.5 md:p-2 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  pendingFile
                    ? isImage
                      ? "text-secondary bg-secondary/10"
                      : "text-primary bg-primary/10"
                    : fileContext?.status === "ready"
                      ? "text-primary bg-primary/10"
                      : isFileProcessing
                        ? "text-yellow-400 animate-pulse"
                        : "text-muted-foreground hover:text-primary hover:bg-surface"
                }`}
              title={
                pendingFile
                  ? isImage
                    ? `Image: ${pendingFile.name}`
                    : `Staged: ${pendingFile.name}`
                  : fileContext?.status === "ready"
                    ? `Active: ${fileContext.fileName}`
                    : isFileProcessing
                      ? "Uploading file..."
                      : "Attach PDF or Image"
              }
              onClick={handleAttachClick}
              disabled={
                disabled ||
                isLoading ||
                isSending ||
                !!pendingFile ||
                !!isFileProcessing
              }
            >
              <span className="material-symbols-outlined">
                {pendingFile && isImage
                  ? "image"
                  : pendingFile || fileContext
                    ? "description"
                    : "attach_file"}
              </span>
            </button>

            {/* Text Input */}
            <textarea
              className="max-h-40 min-h-[32px] md:min-h-[36px] w-full resize-none bg-transparent px-1.5 py-1.5 md:py-2 text-m text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium leading-relaxed"
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading || isSending || isFileProcessing}
              rows={1}
            />

            {/* Voice Input Button */}

            {/* Send Button */}
            <button
              className="flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95 glow-blue-sm"
              onClick={handleSend}
              disabled={!canSend}
              title="Send message"
            >
              {isSending ? (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined font-bold">
                  arrow_upward
                </span>
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground px-1.5">
          {fileContext?.status === "ready"
            ? `📄 Chatting with ${fileContext.fileName} · Encrypted session`
            : "Encrypted session · Ultra-fast latency"}
        </p>
      </div>
    </div>
  );
};

export default InputBar;
