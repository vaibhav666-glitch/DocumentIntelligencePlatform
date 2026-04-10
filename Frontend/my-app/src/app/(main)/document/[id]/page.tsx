"use client";

import { getDocumentById } from "@/services/document.service";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getViewerUrl } from "../../../../lib/viewer";
import Chat from "@/components/document/Chat";

const DocumentChatPage = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [docWidth, setDocWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [readyUrl, setReadyUrl] = useState<string | null>(null);
useEffect(() => {
  if (doc?.fileUrl) {
    const timer = setTimeout(() => {
      setReadyUrl(getViewerUrl(doc?.fileUrl));
    }, 300); // small delay

    return () => clearTimeout(timer);
  }
}, [doc]);

  useEffect(() => {
    const fetchDoc = async () => {
      const res = await getDocumentById(id);
      setDoc(res.data);
    };
    fetchDoc();
  }, [id]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = docWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const totalW = containerRef.current.offsetWidth;
      const dx = e.clientX - startX.current;
      const newPct = startWidth.current + (dx / totalW) * 100;
      setDocWidth(Math.min(Math.max(newPct, 20), 80));
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 py-6 px-4">

    <div
      ref={containerRef}
      className="h-screen flex overflow-hidden "
      style={{ background: "#090a10" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(79,70,229,0.07) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)",
        }}
      />

      {/* LEFT: Document Viewer */}
      <div
        style={{ width: `${docWidth}%`, minWidth: 200 }}
        className="relative z-10 flex flex-col h-full flex-shrink-0"
      >
        {/* Doc header */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#6366f1", boxShadow: "0 0 8px #6366f1" }}
          />
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            {doc?.name ?? "Document"}
          </span>
        </div>

        {/* Scrollable doc area — position relative so overlay sits on top */}
        <div
          className="flex-1 overflow-x-auto overflow-y-auto relative"
          style={{ background: "#0d0f18" }}
        >
          {doc?.fileUrl ? (
            <>
              <iframe
              ref={iframeRef}
                key={readyUrl} src={readyUrl}
                style={{
                  width: "max(100%, 900px)",
                  height: "100%",
                  border: "none",
                  display: "block",
                 
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              />
           
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center h-full gap-3"
              style={{ color: "rgba(255,255,255,0.15)" }}
            >
              <div
                className="w-12 h-14 rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "0.5px solid rgba(99,102,241,0.25)",
                  color: "rgba(99,102,241,0.7)",
                }}
              >
                PDF
              </div>
              <span className="text-sm">Loading document…</span>
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div
        onMouseDown={onMouseDown}
        className="relative z-20 flex items-center justify-center flex-shrink-0 select-none"
        style={{
          width: 6,
          cursor: "col-resize",
          background: isDragging
            ? "rgba(99,102,241,0.4)"
            : "rgba(255,255,255,0.03)",
          transition: isDragging ? "none" : "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!isDragging)
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(99,102,241,0.25)";
        }}
        onMouseLeave={(e) => {
          if (!isDragging)
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(255,255,255,0.03)";
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 2,
            height: 36,
            background: isDragging
              ? "rgba(99,102,241,0.9)"
              : "rgba(255,255,255,0.12)",
            transition: "background 0.15s",
          }}
        />
      </div>

      {/* RIGHT: Chat — also shield it during drag */}
      <div
        className="relative z-10 flex-1 h-full overflow-hidden"
        style={{ pointerEvents: isDragging ? "none" : "auto" }}
      >
        <Chat documentId={id} />
      </div>
    </div>
    </div>
  );
};

export default DocumentChatPage;