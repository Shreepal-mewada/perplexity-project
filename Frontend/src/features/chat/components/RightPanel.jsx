import React, { useState } from "react";

const RightPanel = ({
  isOpen = true,
  sources = [],
  relatedQuestions = [],
  onToggleRightPanel = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("sources");

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="hidden h-full w-60 shrink-0 bg-surface-container border-l border-white/5 backdrop-blur-xl xl:flex xl:flex-col">
      {/* Header */}
      <div className="border-b border-white/5 p-2.5 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/80 font-headline">
            Insights
          </h3>
          <p className="mt-0.5 text-xs text-white/80">
            Sources & related questions
          </p>
        </div>
        {/* Hide Insights Button */}
        <button
          onClick={onToggleRightPanel}
          className="p-1.5 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white/80 shrink-0"
          title="Hide insights"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-2">
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex-1 py-2 text-xs font-medium border-b-2 transition ${
            activeTab === "sources"
              ? "border-secondary text-white/80"
              : "border-transparent text-white/80 hover:text-white/80"
          }`}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveTab("related")}
          className={`flex-1 py-2 text-xs font-medium border-b-2 transition ${
            activeTab === "related"
              ? "border-primary text-white/80"
              : "border-transparent text-white/80 hover:text-white/80"
          }`}
        >
          Related
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-0">
        {activeTab === "sources" && (
          <div className="rounded-2xl bg-white/3 backdrop-blur-xl border border-white/8 p-2.5">
            {sources && sources.length > 0 ? (
              <div className="space-y-2">
                {sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-2 transition group"
                  >
                    <p className="text-xs font-semibold text-secondary group-hover:text-primary transition">
                      <span className="material-symbols-outlined inline text-sm mr-1.5">
                        link
                      </span>
                      {source.title}
                    </p>
                    <p className="mt-1 text-[11px] text-white/80 truncate">
                      {source.domain}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/80">No sources yet</p>
            )}
          </div>
        )}

        {activeTab === "related" && (
          <div className="rounded-2xl bg-white/3 backdrop-blur-xl border border-white/8 p-2.5">
            {relatedQuestions && relatedQuestions.length > 0 ? (
              <div className="space-y-2">
                {relatedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    className="w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-2 text-left text-xs text-white/80 transition hover:text-primary group"
                  >
                    <span className="material-symbols-outlined text-sm mr-1.5 group-hover:text-primary transition">
                      lightbulb
                    </span>
                    {question}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/80">No related questions yet</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
