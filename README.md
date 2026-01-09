<div align="center">
    <img width="1913" height="832" alt="image" src="https://github.com/user-attachments/assets/58790b03-709a-4c37-a853-a3329431fb98" />
</div>

# Insight-RAG Research Assistant

AI-powered research assistant using RAG (Retrieval Augmented Generation) built with Next.js and Groq AI.

## Features

- 📄 Upload and process PDF documents
- 🔍 Intelligent document chunking and retrieval
- 💬 Interactive chat interface with context-aware responses
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 15 and React 19

## Project Structure

```
insight-rag-research-assistant/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ResearchAssistant.tsx  # Main component
│   ├── Sidebar.tsx        # Document sidebar
│   ├── ChatMessages.tsx   # Chat messages container
│   ├── Message.tsx        # Individual message
│   ├── ChatInput.tsx      # Input form
│   ├── ChatHeader.tsx     # Chat header
│   ├── EmptyState.tsx     # Empty state
│   ├── ThinkingIndicator.tsx  # Loading indicator
│   └── icons.tsx          # Icon components
├── lib/                   # Utility functions and services
│   ├── groqService.ts   # Groq AI integration 
│   └── pdfProcessor.ts    # PDF processing utilities
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared types
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API Key 

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your Groq API key:
   ```
   NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## How It Works

1. **Upload PDFs**: Users can upload multiple PDF documents through the sidebar
2. **Processing**: PDFs are processed client-side, extracting text and chunking it for efficient retrieval
3. **RAG Query**: When a question is asked, relevant chunks are retrieved using semantic matching
4. **AI Response**: The retrieved context is sent to Groq AI along with the question to generate accurate, context-aware responses

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Groq AI (Llama 3.3 70B)** - Language model (Fast inference, free tier available)
- **PDF.js** - PDF processing
- **Marked** - Markdown parsing

## Notes on Groq AI

This application uses **Llama 3.3 70B Versatile** as the primary model and **Llama 3.1 8B Instant** as a fallback. Groq provides:
- **Ultra-fast inference** - Optimized for speed
- **Free tier available** - Generous free usage limits
- **Rate limits** - May apply based on your plan
- If you exceed limits, you'll see helpful error messages with retry information

Get your API key at [Groq Console](https://console.groq.com/)

## License

MIT
