# 🧠 Intelligent Document Platform (RAG-based AI System)

---

## 🚀 Project Overview

This project is an **AI-powered Intelligent Document Platform** that allows users to:

* Upload documents (PDF, DOCX, PPTX)
* Automatically process and extract content
* Ask questions and chat with their documents
* Get intelligent answers using Retrieval-Augmented Generation (RAG)
* Receive smart follow-up question suggestions

The system is designed to handle large documents efficiently using vector search and LLM-based reasoning.

---

## 🛠️ Tech Stack

### Frontend

* Next.js (React)
* Tailwind CSS

### Backend

* Node.js + Express / NestJS
* MongoDB (primary database)
* Vector Database (MongoDB Vector / embedding storage)

### AI / Processing

* LangChain (RAG pipeline orchestration)
* Groq (LLM inference)

### Realtime & Queue

* Redis (Pub/Sub + Queue support)
* WebSocket (real-time updates)

---

## 🤔 Why This Stack?

* **LangChain** → simplifies RAG pipeline and document chaining
* **Groq** → fast inference for chat responses
* **MongoDB** → flexible schema + vector storage
* **Redis** → async processing + pub/sub events
* **WebSocket** → real-time UI updates (processing → ready)

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env`:

```env
PORT=
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
OPENAI_API_KEY=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
CLOUDINARY_URL=
REDIS_URL=
HF_API_KEY=
```

### 4. Run Backend

# Start main backend server
npm run start

# Start worker (for document processing / embeddings)
npm run start:worker

### 5. Run Frontend

```bash
npm run dev
```

---

## 🏗️ High-Level Architecture

```
                ┌───────────────┐
                │   Frontend    │
                │ (Next.js UI)  │
                └──────┬────────┘
                       │
                       ▼
                ┌───────────────┐
                │   Backend API │
                └──────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌─────────┐   ┌──────────┐   ┌──────────┐
   │ MongoDB │   │  Redis   │   │  Groq LLM│
   │ (Docs)  │   │ (Queue)  │   │          │
   └────┬────┘   └────┬─────┘   └────┬─────┘
        ▼             ▼              ▼
   Vector Store   Workers        LangChain
      (Embeds)     (Async)       (RAG)
```

---

## 📥 Document Ingestion Flow

1. User uploads document
2. File stored (Cloudinary)
3. Backend pushes job to Redis queue
4. Worker processes file:

   * Extract text
   * Chunk content
   * Generate embeddings
5. Store embeddings in vector DB
6. Notify frontend via WebSocket

---

## ⚙️ Processing Pipeline

```
Upload → Extract → Clean → Chunk → Embed → Store
```

---

## 🔍 Retrieval Flow (RAG)

```
User Query → Embedding → Similarity Search → Top Chunks → LLM → Answer
```

---

## 💬 Chat Interaction Flow

1. User asks question
2. Backend retrieves relevant chunks
3. LangChain constructs prompt
4. Groq generates answer
5. Chat stored in DB
6. UI updates in real-time

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* User-specific document access
* Each document is scoped to a user

---

## 🤖 AI Agent Design

The system uses a **RAG-based AI agent**:

* Retrieves relevant document chunks
* Injects into prompt
* Generates contextual answers

### Purpose:

* Avoid hallucination
* Ensure answers are grounded in documents

---

## 💡 Custom Feature: Smart Question Suggestions

After each response, system generates:

* Context-aware follow-up questions
* Improves user engagement
* Helps explore document deeply

### Why we built it:

* Reduces user thinking effort
* Improves UX
* Mimics ChatGPT-style interaction

---

## ⚖️ Key Design Decisions

### 1. RAG over fine-tuning

* Faster
* Cheaper
* More flexible

### 2. Redis Queue

* Handles async embedding
* Prevents blocking API

### 3. WebSocket

* Real-time updates (processing → ready)

### 4. Chunk-based retrieval

* Improves accuracy
* Reduces token usage

---

## ⚠️ Trade-offs

* PPT parsing less reliable than PDF
* External LLM dependency (Groq)
* Vector search depends on chunk quality

---

## ❗ Known Limitations

* PPT/PPTM parsing may be inconsistent
* Large documents may take time to process
* Google viewer iframe instability for non-PDF

---

## 🚀 Future Improvements

* Convert all docs → PDF pipeline
* Streaming responses (ChatGPT-like)
* Highlight answer inside document
* Multi-document comparison

---

## 🧩 Key System Components

* Document Service
* Embedding Worker
* Chat Service
* Vector Store
* WebSocket Service

---

## 🎯 Conclusion

This system demonstrates a scalable and production-ready architecture for building an **AI-powered document intelligence platform** using modern tools like LangChain, Redis, and vector search.

---
