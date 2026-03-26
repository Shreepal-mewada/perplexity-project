import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

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

  //

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#212121] overflow-hidden text-sm">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full px-4 md:px-4 py-3 md:py-4 min-h-0 scrollbar-styled">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center px-4 md:px-2">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-5xl">
                  sparkles
                </span>
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white/80 font-headline">
                Ask anything...
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs md:text-sm leading-5 md:leading-6 text-white/80">
                Get instant answers, create content, and explore ideas with
                Zyricon AI
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-2 md:px-3 py-1.5 text-xs md:text-sm text-white/80 transition hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    lightbulb
                  </span>
                  <span>Explain React</span>
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-2 md:px-3 py-1.5 text-xs md:text-sm text-white/80 transition hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    build
                  </span>
                  <span>Fix my code</span>
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-2 md:px-3 py-1.5 text-xs md:text-sm text-white/80 transition hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary">
                  <span className="material-symbols-outlined text-base">
                    rocket
                  </span>
                  <span>Build a project</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-5xl flex-col space-y-4 md:space-y-6 mx-auto overflow-x-hidden px-3 md:px-6 pb-28">
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
