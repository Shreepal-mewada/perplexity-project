import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Sparkles } from "lucide-react";

const ChatArea = ({
  messages = [],
  loading = false,
  currentTitle = "New Chat",
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isEmpty = !messages || messages.length === 0;

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header - Fixed and visible */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm px-4 md:px-6 py-4 shrink-0 w-full">
        <h2 className="text-base md:text-lg font-semibold text-white truncate">
          {currentTitle}
        </h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto w-full px-3 md:px-8 py-4 md:py-6 min-h-0">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center px-2">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Sparkles size={34} />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white">
                Ask anything...
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-xs md:text-sm leading-6 md:leading-7 text-slate-400">
                Get instant answers, create content, and explore ideas
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white">
                  <span>💡</span>
                  <span>Explain React</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white">
                  <span>🔧</span>
                  <span>Fix my code</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white">
                  <span>🚀</span>
                  <span>Build a project</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-4xl flex-col gap-3 md:gap-4 mx-auto">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message.content || message.text}
                sender={message.role === "user" ? "user" : "ai"}
              />
            ))}
            {loading && (
              <MessageBubble
                message="Thinking..."
                sender="ai"
                isLoading={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
