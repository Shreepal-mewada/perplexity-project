import React, { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

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
    <div className="w-full px-3 md:px-4 py-3 backdrop-blur-sm shrink-0 ">
      <div className="mx-auto max-w-4xl w-full ">
        <div className="rounded-3xl border border-slate-600 bg-slate-700/50 p-2 md:p-2 shadow-lg shadow-slate-950/50">
          <div className="flex items-end gap-2 md:gap-2">
            {/* Attach File Button */}
            <button
              className="rounded-2xl p-2 md:p-2 text-slate-400 transition hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Attach file"
              disabled={disabled || isLoading}
            >
              <Paperclip size={18} className="md:w-5 md:h-5" />
            </button>

            {/* Input Field */}
            <textarea
              className="max-h-40 min-h-[40px] md:min-h-[28px] w-full resize-none rounded-2xl bg-transparent px-2 py-2 md:py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              rows={1}
            />

            {/* Voice Input Button */}
            <button
              className="rounded-2xl p-2 md:p-2 text-slate-400 transition hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Voice input"
              disabled={disabled || isLoading}
            >
              <Mic size={18} className="md:w-5 md:h-5" />
            </button>

            {/* Send Button */}
            <button
              className="flex h-10 md:h-10 w-10 md:w-10 items-center justify-center rounded-2xl bg-cyan-500 text-white transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500 shrink-0"
              onClick={handleSend}
              disabled={!input.trim() || disabled || isLoading}
              title="Send message"
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500 px-2">
          AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  );
};

export default InputBar;
