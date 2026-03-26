import React, { useState } from "react";

const InputBar = ({ onSendMessage, disabled = false, isLoading = false }) => {
  const [input, setInput] = useState("");

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

  return (
    <div className="w-full px-3 md:px-6 py-2 backdrop-blur-xl shrink-0 bg-[#212121]">
      <div className="mx-auto max-w-5xl w-full">
        <div className="rounded-full border border-white/10 bg-white/3 backdrop-blur-xl p-1.5 md:p-2 shadow-2xl shadow-black/60 ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Attach File Button */}
            <button
              className="h-8 md:h-9 w-8 md:w-9 rounded-xl p-1.5 md:p-2 text-white/80 transition hover:text-primary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Attach file"
              disabled={disabled || isLoading}
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>

            {/* Input Field */}
            <textarea
              className="max-h-40 min-h-[32px] md:min-h-[36px] w-full resize-none bg-transparent px-1.5 py-1.5 md:py-2 text-m text-white/80 placeholder:text-white/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium leading-relaxed"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              rows={1}
            />

            {/* Voice Input Button */}
            <button
              className="rounded-xl p-1.5 md:p-2 text-white/80 transition hover:text-secondary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Voice input"
              disabled={disabled || isLoading}
            >
              <span className="material-symbols-outlined">mic</span>
            </button>

            {/* Send Button */}
            <button
              className="flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-container text-black transition hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95"
              onClick={handleSend}
              disabled={!input.trim() || disabled || isLoading}
              title="Send message"
            >
              <span className="material-symbols-outlined font-bold">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-white/80 px-1.5">
          Encrypted session • Ultra-fast latency
        </p>
      </div>
    </div>
  );
};

export default InputBar;
