import React, { useState } from "react";
import { X } from "lucide-react";

const RightPanel = ({ isOpen = true, sources = [], relatedQuestions = [] }) => {
  const [activeTab, setActiveTab] = useState("sources");

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="hidden h-full w-80 shrink-0 border-l border-slate-700 bg-slate-800/50 backdrop-blur-xl xl:flex xl:flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 p-5 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Insights</h3>
          <p className="mt-1 text-sm text-slate-400">
            Sources & related questions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 px-4">
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "sources"
              ? "border-cyan-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveTab("related")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "related"
              ? "border-cyan-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Related
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
        {activeTab === "sources" && (
          <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
            {sources && sources.length > 0 ? (
              <div className="space-y-3">
                {sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl bg-slate-900/50 p-3 hover:bg-slate-900 transition"
                  >
                    <p className="text-sm font-medium text-white">
                      🔗 {source.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {source.domain}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No sources yet</p>
            )}
          </div>
        )}

        {activeTab === "related" && (
          <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-4">
            {relatedQuestions && relatedQuestions.length > 0 ? (
              <div className="space-y-2">
                {relatedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    className="w-full rounded-2xl bg-slate-900/50 p-3 text-left text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                  >
                    ❓ {question}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No related questions yet</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
