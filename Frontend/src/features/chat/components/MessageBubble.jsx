import React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MessageBubble.css";

const MessageBubble = ({ message, sender = "user", isLoading = false }) => {
  return (
    <div
      className={`flex w-full ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-xs md:max-w-2xl items-start gap-2 md:gap-2 ${sender === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`mt-1 flex h-7 md:h-9 w-7 md:w-9 shrink-0 items-center justify-center rounded-full text-sm md:text-base ${sender === "user" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"}`}
        >
          {sender === "user" ? (
            <User size={16} className="md:w-[18px] md:h-[18px]" />
          ) : (
            <Bot size={16} className="md:w-[18px] md:h-[18px]" />
          )}
        </div>
        <div
          className={`rounded-2xl md:rounded-3xl border px-3 md:px-4 py-2 md:py-3 shadow-lg text-sm md:text-base overflow-x-auto ${sender === "user" ? "border-cyan-400/20 bg-cyan-500/10 text-white" : "border-slate-700 bg-slate-800/80 text-slate-100"}`}
        >
          <p className="mb-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
            {sender === "user" ? "You" : "Assistant"}
          </p>
          {isLoading ? (
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          ) : sender === "user" ? (
            <p className="leading-6 md:leading-7 break-words">{message}</p>
          ) : (
            <div className="markdown-content leading-6 md:leading-7 max-w-full">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
