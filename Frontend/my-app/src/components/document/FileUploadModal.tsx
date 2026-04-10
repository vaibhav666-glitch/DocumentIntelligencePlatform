import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../lib/socket";
import { postDocument } from "@/services/document.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  
  useEffect(() => {
    socket.on("document-status", (data) => {
      console.log("hello manss")
      console.log("socket data", data);

      if (data.status === "processing") {
        setStatus("Processing...");
      } else if (data.status === "ready") {
        setStatus("✅ Ready");
        setTimeout(()=>{onClose},4000)
      } else if (data.status === "failed") {
        {setStatus("❌ Failed");
         setError(data?.failureReason)

        }
      }
    });

    return () => {
      socket.off("document-status");
    };
  }, []);

 
  const handleFile = (f: File) => {
    setFile(f);
    setError("");
  };


  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setStatus("Uploading...");
      setError("");

      const res=await postDocument(file)
      console.log("am res",res)
      setStatus("Processing...");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Upload failed");
      setStatus("");
    }
  };

 
  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center"
  style={{ background: "rgba(9,10,16,0.75)", backdropFilter: "blur(8px)" }}
>
  <div
    className="w-[420px] rounded-2xl overflow-hidden"
    style={{
      background: "#0f1118",
      border: "0.5px solid rgba(255,255,255,0.09)",
    }}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-5 pt-5 pb-0">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "#6366f1", boxShadow: "0 0 8px rgba(99,102,241,0.9)" }}
        />
        <span className="text-xl font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
          Upload document
        </span>
      </div>
      <button
        onClick={onClose}
        className="w-6 h-6 flex items-center justify-center rounded-md text-xl transition-colors"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.35)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)")
        }
      >
        ✕
      </button>
    </div>

    {/* Drop zone */}
    <div className="px-5 pt-4 pb-2">
      <div
        className="rounded-xl p-8 text-center cursor-pointer transition-all"
        style={{
          border: `1px dashed ${dragActive ? "rgba(99,102,241,0.7)" : "rgba(99,102,241,0.25)"}`,
          background: dragActive ? "rgba(99,102,241,0.09)" : "rgba(99,102,241,0.03)",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
        onMouseEnter={(e) => {
          if (!dragActive) {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.06)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.45)";
          }
        }}
        onMouseLeave={(e) => {
          if (!dragActive) {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.03)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.25)";
          }
        }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "0.5px solid rgba(99,102,241,0.25)",
          }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="rgba(99,102,241,0.85)" strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        {file ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              {file.name}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "0.5px solid rgba(99,102,241,0.25)",
                color: "rgba(99,102,241,0.85)",
              }}
            >
              ready
            </span>
          </div>
        ) : (
          <p className="text-xl leading-relaxed" style={{ color: "#fff" }}>
            <span style={{ color: "rgba(99,102,241,0.85)", fontWeight: 500 }}>
              Click to browse
            </span>{" "}
            or drag &amp; drop
            <br />
            PDF, DOCX, TXT — up to 20MB
          </p>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />

      {/* Error */}
      {error && (
        <p
          className="text-xl mt-3 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "0.5px solid rgba(239,68,68,0.2)",
            color: "rgba(239,68,68,0.85)",
          }}
        >
          {error}
        </p>
      )}

      {/* Status */}
      {status && (
        <p
          className="text-xl mt-3 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "0.5px solid rgba(99,102,241,0.2)",
            color: "rgba(99,102,241,0.85)",
          }}
        >
          {status}
        </p>
      )}

      {/* Privacy hint */}
      <p className="text-2xl text-center mt-3" style={{ color: "#a0a0a0" }}>
        Processed securely — files are never stored beyond your session
      </p>
    </div>

    {/* Footer */}
    <div
      className="flex justify-end gap-2 px-5 py-4"
      style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={onClose}
        className="px-4 py-1.5 rounded-lg text-xl transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.09)",
          color: "rgba(255,255,255,0.4)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)")
        }
      >
        Cancel
      </button>

      <button
        onClick={handleUpload}
        className="px-4 py-1.5 rounded-lg text-xl font-medium text-white flex items-center gap-1.5 transition-opacity"
        style={{
          background: "linear-gradient(135deg, #4338ca, #6366f1)",
          border: "0.5px solid rgba(99,102,241,0.4)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
        }
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
    </div>
  </div>
</div>
  );
};

export default FileUploadModal;