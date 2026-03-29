import React, { useState, useEffect } from "react";
import appIcon from "../../../assets/image.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MessageBubble.css";

const MessageBubble = ({
  message,
  sender = "user",
  isLoading = false,
  isNewReply = false,
  type,
  fileName,
  url,
}) => {
  const [displayedText, setDisplayedText] = useState(
    isNewReply && !isLoading && sender === "ai" ? "" : message,
  );
  const [isTyping, setIsTyping] = useState(
    isNewReply && !isLoading && sender === "ai",
  );

  useEffect(() => {
    // If it's not a live new reply, don't animate at all.
    // Also, don't animate user messages or loading stubs.
    if (!isNewReply || isLoading || sender === "user" || !message) {
      setDisplayedText(message);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    const totalDurationMs = Math.min(message.length * 15, 2500);
    const tickRateMs = 30; // ~33 fps
    const charsPerTick = Math.max(
      1,
      Math.floor(message.length / (totalDurationMs / tickRateMs)),
    );

    const intervalId = setInterval(() => {
      currentIndex += charsPerTick;
      if (currentIndex >= message.length) {
        setDisplayedText(message);
        setIsTyping(false);
        clearInterval(intervalId);
      } else {
        setDisplayedText(message.substring(0, currentIndex));
      }
    }, tickRateMs);

    return () => clearInterval(intervalId);
  }, [message, sender, isLoading, isNewReply]);

  const handleSkipTyping = () => {
    if (isTyping) {
      setDisplayedText(message);
      setIsTyping(false);
    }
  };

  // ── Image Upload Card ──
  if (type === "image") {
    // url is a blob URL (optimistic) or a server path like /uploads/images/xxx.jpg
    const backendHost =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
      "https://perplexity-project-zac5.onrender.com";
    const imageSrc = url?.startsWith("blob:")
      ? url
      : url
        ? `${backendHost}${url}`
        : null;

    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-[96%] md:max-w-[80%] lg:max-w-[70%] items-start gap-2 md:gap-4 flex-row-reverse">
          {/* Avatar */}
          <div className="mt-1 hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-base font-semibold">
            <span className="material-symbols-outlined text-[24px]">
              account_circle
            </span>
          </div>
          {/* Image Card Bubble */}
          <div className="glass rounded-[20px] md:rounded-3xl px-4 md:px-5 py-3 md:py-4 bg-primary/20 rounded-tr-sm premium-shadow flex flex-col items-end gap-2.5 min-w-[200px] max-w-full">
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 text-right self-end">
              You
            </p>
            {/* Image thumbnail */}
            {imageSrc && (
              <div className="w-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src={imageSrc}
                  alt={fileName || "Uploaded image"}
                  className="w-full max-h-72 object-cover rounded-xl"
                />
              </div>
            )}
            {/* File name strip */}
            <div className="flex items-center gap-2 bg-background/40 rounded-lg px-2.5 py-1.5 border border-white/10 w-full">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                image
              </span>
              <span className="text-xs font-medium text-foreground truncate">
                {fileName}
              </span>
            </div>
            {/* Optional user message text */}
            {message && (
              <div className="w-full text-left mt-0.5 text-[15px] md:text-base text-foreground break-words whitespace-pre-wrap">
                <p className="leading-relaxed md:leading-7">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── File Upload Card (ChatGPT-style PDF message) ──
  if (type === "file") {
    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-[96%] md:max-w-[85%] lg:max-w-[75%] items-start gap-2 md:gap-4 flex-row-reverse">
          {/* Avatar */}
          <div className="mt-1 hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-base font-semibold">
            <span className="material-symbols-outlined text-[24px]">
              account_circle
            </span>
          </div>
          {/* File Card Bubble */}
          <div className="glass rounded-[20px] md:rounded-3xl px-4 md:px-5 py-3 md:py-4 bg-primary/20 rounded-tr-sm premium-shadow flex flex-col items-end gap-2 min-w-[200px]">
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 text-right">
              You
            </p>
            <div className="flex items-center gap-3 bg-background/40 rounded-xl px-3 py-2.5 border border-white/10 w-full">
              {/* PDF Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/20">
                <span
                  className="material-symbols-outlined text-red-400 text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  picture_as_pdf
                </span>
              </div>
              {/* File Info */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate max-w-[160px]">
                  {fileName}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Uploaded document
                </span>
              </div>
            </div>

            {/* Display message text if it exists */}
            {message && (
              <div className="w-full text-left mt-1.5 text-[15px] md:text-base text-foreground break-words whitespace-pre-wrap">
                <p className="leading-relaxed md:leading-7">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[96%] md:max-w-[85%] lg:max-w-[75%] items-start gap-2 md:gap-4 ${
          sender === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`mt-1 hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
            sender === "user"
              ? "bg-primary/20 text-primary"
              : "bg-secondary/20 text-secondary"
          }`}
        >
          {sender === "user" ? (
            <span className="material-symbols-outlined text-[24px]">
              account_circle
            </span>
          ) : (
            <img
              src={appIcon}
              alt="Zyricon AI Logo"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`glass rounded-[20px] md:rounded-3xl px-4 md:px-5 py-3 md:py-4 text-[15px] md:text-base flex flex-col ${
            sender === "user"
              ? "bg-primary/20 text-foreground items-end rounded-tr-sm"
              : "text-foreground items-start overflow-x-auto rounded-tl-sm premium-shadow"
          }`}
        >
          <p
            className={`mb-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 ${sender === "user" ? "text-right" : "text-left"}`}
          >
            {sender === "user" ? "You" : "Zyricon AI"}
          </p>

          {isLoading ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-foreground animate-pulse"></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-foreground animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-foreground animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          ) : sender === "user" ? (
            <p className="leading-relaxed md:leading-7 break-words whitespace-pre-wrap">
              {displayedText}
            </p>
          ) : (
            <div
              className="markdown-content leading-relaxed md:leading-7 max-w-full break-words relative overflow-x-hidden"
              onClick={handleSkipTyping}
              title={isTyping ? "Click to skip animation" : ""}
              style={{ cursor: isTyping ? "pointer" : "default" }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedText + (isTyping ? " ▌" : "")}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
