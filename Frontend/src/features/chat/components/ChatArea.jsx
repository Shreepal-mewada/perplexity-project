import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Sparkles } from "lucide-react";

const ChatArea = ({
  messages = [],
  loading = false,
  // currentTitle = "New Chat",
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
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full px-3 md:px-6 py-4 md:py-6 min-h-0 scrollbar-styled">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center px-2">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Sparkles size={34} />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white">
                Ask anything...
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-xs md:text-sm leading-6 md:leading-7 text-slate-400">
                Get instant answers, create content, and explore ideas
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
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
          <div className="flex w-full max-w-4xl flex-col gap-2 md:gap-3 mx-auto overflow-hidden">
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
