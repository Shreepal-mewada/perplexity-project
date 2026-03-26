import React from "react";
import appIcon from "../../../assets/image.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MessageBubble.css";

const MessageBubble = ({ message, sender = "user", isLoading = false }) => {
  return (
    <div
      className={`flex w-full ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] items-start gap-2.5 md:gap-4 ${
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
          className={`border border-white/5 shadow-lg rounded-[20px] md:rounded-3xl backdrop-blur-xl px-4 md:px-5 py-3 md:py-4 text-[15px] md:text-base flex flex-col ${
            sender === "user"
              ? "bg-primary/20 text-white/90 shadow-primary/10 items-end rounded-tr-sm"
              : "bg-[#2a2a2a] text-white/90 shadow-black/20 items-start overflow-x-auto rounded-tl-sm"
          }`}
        >
          <p className={`mb-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-white/50 ${sender === "user" ? "text-right" : "text-left"}`}>
            {sender === "user" ? "You" : "Zyricon AI"}
          </p>

          {isLoading ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-white/80 animate-pulse"></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-white/80 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-white/80 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          ) : sender === "user" ? (
            <p className="leading-relaxed md:leading-7 break-words whitespace-pre-wrap">{message}</p>
          ) : (
            <div className="markdown-content leading-relaxed md:leading-7 max-w-full break-words">
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