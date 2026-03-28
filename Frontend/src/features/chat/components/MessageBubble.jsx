import React, { useState, useEffect } from "react";
import appIcon from "../../../assets/image.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MessageBubble.css";

const MessageBubble = ({ message, sender = "user", isLoading = false, isNewReply = false }) => {
  const [displayedText, setDisplayedText] = useState(isNewReply && !isLoading && sender === "ai" ? "" : message);
  const [isTyping, setIsTyping] = useState(isNewReply && !isLoading && sender === "ai");

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
    const charsPerTick = Math.max(1, Math.floor(message.length / (totalDurationMs / tickRateMs)));

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
  return (
    <div
      className={`flex w-full ${sender === "user" ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`flex max-w-[96%] md:max-w-[85%] lg:max-w-[75%] items-start gap-2 md:gap-4 ${sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
      >
        {/* Avatar */}
        <div
          className={`mt-1 hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold ${sender === "user"
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
          className={`glass rounded-[20px] md:rounded-3xl px-4 md:px-5 py-3 md:py-4 text-[15px] md:text-base flex flex-col ${sender === "user"
            ? "bg-primary/20 text-foreground items-end rounded-tr-sm"
            : "text-foreground items-start overflow-x-auto rounded-tl-sm premium-shadow"
            }`}
        >
          <p className={`mb-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 ${sender === "user" ? "text-right" : "text-left"}`}>
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
            <p className="leading-relaxed md:leading-7 break-words whitespace-pre-wrap">{displayedText}</p>
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