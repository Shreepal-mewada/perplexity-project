import React, { useRef } from "react";
import { useSelector } from "react-redux";
import FileUploadBadge from "./FileUploadBadge";

const InputBar = ({
  onSendMessage,
  onUploadFile,
  onClearFile,
  disabled = false,
  isLoading = false,
}) => {
  const [input, setInput] = React.useState("");
  const fileInputRef = useRef(null);
  const { fileContext } = useSelector((state) => state.chat);

  const handleSend = () => {
    if (input.trim() && !disabled && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    if (!disabled && !isLoading && !fileContext) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) {
      onUploadFile(file);
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const isFileProcessing =
    fileContext && ["uploading", "parsing", "embedding", "indexing"].includes(fileContext.status);

  return (
    <div className="w-full px-2 md:px-6 py-2 backdrop-blur-xl shrink-0 bg-background/80">
      {/* Hidden file input — PDF only */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* File Upload Badge — shown when file is active */}
      {fileContext && (
        <FileUploadBadge
          fileName={fileContext.fileName}
          status={fileContext.status}
          errorMessage={fileContext.errorMessage}
          onClear={onClearFile}
        />
      )}

      <div className="mx-auto w-[90%] max-w-[1200px]">
        <div className="rounded-full glass p-1.5 md:p-2 premium-shadow ring-1 ring-glass-border">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Attach File Button */}
            <button
              className={`h-8 md:h-9 w-8 md:w-9 rounded-xl p-1.5 md:p-2 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
                ${fileContext?.status === "ready"
                  ? "text-primary bg-primary/10"
                  : isFileProcessing
                    ? "text-yellow-400 animate-pulse"
                    : "text-muted-foreground hover:text-primary hover:bg-surface"
                }`}
              title={
                fileContext?.status === "ready"
                  ? `Active: ${fileContext.fileName}`
                  : isFileProcessing
                    ? "Indexing file..."
                    : "Attach PDF file"
              }
              onClick={handleAttachClick}
              disabled={disabled || isLoading || !!isFileProcessing}
            >
              <span className="material-symbols-outlined">
                {fileContext ? "description" : "attach_file"}
              </span>
            </button>

            {/* Input Field */}
            <textarea
              className="max-h-40 min-h-[32px] md:min-h-[36px] w-full resize-none bg-transparent px-1.5 py-1.5 md:py-2 text-m text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium leading-relaxed"
              placeholder={
                fileContext?.status === "ready"
                  ? `Ask about ${fileContext.fileName}...`
                  : isFileProcessing
                    ? "Indexing file, please wait..."
                    : "Ask anything..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading || isFileProcessing}
              rows={1}
            />

            {/* Voice Input Button */}
            <button
              className="rounded-xl p-1.5 md:p-2 text-muted-foreground transition hover:text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Voice input"
              disabled={disabled || isLoading}
            >
              <span className="material-symbols-outlined">mic</span>
            </button>

            {/* Send Button */}
            <button
              className="flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95 glow-blue-sm"
              onClick={handleSend}
              disabled={!input.trim() || disabled || isLoading || isFileProcessing}
              title="Send message"
            >
              <span className="material-symbols-outlined font-bold">arrow_upward</span>
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
