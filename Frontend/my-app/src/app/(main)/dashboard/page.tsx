"use client";
import FileUploadModal from "@/components/document/FileUploadModal";
import Loader from "@/components/common/Loader";
import { getAllDocument, deleteDocument } from "@/services/document.service";
import { Plus, Trash2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const DashboardPage = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const router = useRouter();
const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await getAllDocument();
      setDocuments(res.data); // IMPORTANT (based on your API)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Your Documents 📄
          </h1>
          <p className="text-gray-300 mt-1 text-sm">
            Upload, analyze & chat with your documents using AI
          </p>
        </div>

<button
  onClick={() => setIsModalOpen(true)}
  className="bg-white text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow hover:scale-105 transition"
>
  <Plus size={18} />
  Upload
</button>
      </div>

      {/* Documents */}
      <div className="max-w-7xl mx-auto">
        {documents.length === 0 ? (
          <div className="text-center py-20 border border-white/20 rounded-xl bg-white/10 backdrop-blur">
            <p className="text-gray-300">
              No documents uploaded yet 🚀
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-[1.03] transition"
              
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>

                {/* File Icon */}
                <div className="text-4xl mb-4 text-amber-100"
               
                >
                  <FileText />
                </div>

                {/* File Name */}
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2"
                onClick={() => router.push(`/document/${doc._id}`)}
                >
                  {doc.fileName}
                </h3>

                {/* Status */}
                <div className="mb-3"
                onClick={() => router.push(`/document/${doc._id}`)}
                >
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === "ready"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center"
                 onClick={() => router.push(`/document/${doc._id}`)}
                >
                 

                  <button className="text-indigo-300 text-sm"
                  >
                    Chat 💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    <FileUploadModal
  isOpen={isModalOpen}
  onClose={() =>{ setIsModalOpen(false);
    fetchDocs();
  }}
/>
    </div>
  );
};

export default DashboardPage;