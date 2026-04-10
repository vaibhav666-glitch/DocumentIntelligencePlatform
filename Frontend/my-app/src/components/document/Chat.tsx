"use client";

import {
  getChatHistory,
  getFollowUpSuggestion,
  getInitialSuggestion,
  postQuestion,
} from "@/services/chat.service";
import { useEffect, useRef, useState } from "react";

const Chat = ({ documentId }: any) => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [initialSuggestion, setInitialSuggestion] = useState<any[]>([]);
  const [followupSuggestion, setFollowupSuggestion] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await getChatHistory(documentId);
        setChatHistory(res.data);
        const initia = await getInitialSuggestion(documentId);
        setInitialSuggestion(initia?.suggestions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChat();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClick = () => setShowSuggestions(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;
    setFollowupSuggestion([]);
    setChatHistory((prev) => [...prev, { role: "user", content: question }]);
    try {
      setLoading(true);
      const res = await postQuestion({ documentId, question });
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: res.answer },
      ]);
      const follow = await getFollowUpSuggestion(documentId, {
        question,
        answer: res.answer,
      });
      setFollowupSuggestion(follow?.suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = initialSuggestion?.filter((q) =>
    q.toLowerCase().includes(input.toLowerCase())
  );

  const send = () => {
    handleAskQuestion(input);
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "#0c0e16", color: "rgba(255,255,255,0.85)" }}
    >
      {/* HEADER */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          }}
        >
          AI
        </div>
        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Chat with Document
        </span>
        <div
          className="ml-auto w-2 h-2 rounded-full"
          style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "0.5px solid rgba(99,102,241,0.2)",
              }}
            >
              💬
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ask anything about this document
            </p>
            {initialSuggestion?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {initialSuggestion.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskQuestion(q)}
                    className="px-3 py-2 text-xs rounded-xl transition-all"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "0.5px solid rgba(99,102,241,0.2)",
                      color: "rgba(99,102,241,0.9)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(99,102,241,0.2)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(99,102,241,0.1)")
                    }
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xl font-semibold mr-2 mt-1 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white" }}
              >
                AI
              </div>
            )}
            <div
              className="max-w-[78%] px-4 py-2.5 text-xl leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: "linear-gradient(135deg, #4338ca, #6366f1)",
                      color: "white",
                      borderRadius: "16px 4px 16px 16px",
                      boxShadow: "0 4px 20px rgba(79,70,229,0.25)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.82)",
                      borderRadius: "4px 16px 16px 16px",
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Follow-up chips */}
        {followupSuggestion.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-8">
            {followupSuggestion.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAskQuestion(q)}
                className="px-3 py-1.5 text-lg rounded-full transition-all"
                style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "0.5px solid rgba(99,102,241,0.2)",
                  color: "rgba(99,102,241,0.85)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(99,102,241,0.18)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(99,102,241,0.08)")
                }
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Thinking bubble */}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white" }}
            >
              AI
            </div>
            <div
              className="px-4 py-2.5 text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "4px 16px 16px 16px",
                color: "#fff",
              }}
            >
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* SUGGESTIONS DROPDOWN */}
      {showSuggestions && input && filteredSuggestions?.length > 0 && (
        <div
          className="mx-4 mb-1 rounded-xl overflow-hidden max-h-36 overflow-y-auto"
          style={{
            background: "#1a1c28",
            border: "0.5px solid rgba(255,255,255,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredSuggestions.map((q, i) => (
            <div
              key={i}
              onClick={() => {
                handleAskQuestion(q);
                setInput("");
                setShowSuggestions(false);
              }}
              className="px-4 py-2.5 text-lg cursor-pointer transition-colors"
              style={{ color: "rgba(255,255,255,0.7)", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "rgba(99,102,241,0.1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = "")
              }
            >
              {q}
            </div>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div
        className="px-4 py-3 flex gap-2 items-center flex-shrink-0"
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder="Ask something about this document…"
          className="flex-1 text-sm outline-none rounded-xl px-4 py-2.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.85)",
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLInputElement).style.border =
              "0.5px solid rgba(99,102,241,0.5)")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLInputElement).style.border =
              "0.5px solid rgba(255,255,255,0.1)")
          }
        />
        <button
          onClick={send}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #4338ca, #6366f1)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;