'use client';

import { useState, useRef, useEffect } from 'react';
import { DocumentSource, ChatMessage } from '@/types';
import { extractTextFromPdf, chunkText } from '@/lib/pdfProcessor';
import { generateRAGResponse, retrieveRelevantContext } from '@/lib/groqService';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ResearchAssistant() {
  const [docs, setDocs] = useState<DocumentSource[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newDocs: DocumentSource[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf') continue;

      try {
        const text = await extractTextFromPdf(file);
        const chunks = chunkText(text);
        
        newDocs.push({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          content: text,
          chunks: chunks,
          status: 'ready',
          size: file.size
        });
      } catch (err) {
        console.error('Error processing PDF:', err);
      }
    }

    setDocs(prev => [...prev, ...newDocs]);
    setIsProcessing(false);
    e.target.value = '';
  };

  const removeDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const allChunks = docs.flatMap(d => d.chunks);
      let context = "";
      if (allChunks.length > 0) {
        const relevant = await retrieveRelevantContext(userMessage.text, allChunks);
        context = relevant.join('\n\n---\n\n');
      } else {
        context = "No documents uploaded yet. Inform the user to upload PDFs for specific research.";
      }

      const history = messages.slice(-4).map(m => ({ role: m.role, text: m.text }));
      const answer = await generateRAGResponse(userMessage.text, context, history);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: answer,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error getting response:', err);
      
      let errorMessage = "I encountered an error while processing your request.";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status === 'RESOURCE_EXHAUSTED' || err?.code === 429) {
        errorMessage = "⚠️ Rate limit exceeded. The free tier has daily limits. Please wait a moment and try again, or check your API usage at https://ai.google.dev/";
      } else if (err?.message?.includes('API key')) {
        errorMessage = "❌ API key error. Please check your NEXT_PUBLIC_GROQ_API_KEY in .env.local file.";
      } else if (err?.message?.includes('quota')) {
        errorMessage = "⚠️ Quota exceeded. The free tier has usage limits. Please wait before trying again or check your usage at https://ai.google.dev/";
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: errorMessage,
        timestamp: Date.now()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        docs={docs}
        isProcessing={isProcessing}
        onFileUpload={handleFileUpload}
        onRemoveDoc={removeDoc}
      />

      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <ChatHeader />

        <ChatMessages 
          messages={messages}
          isThinking={isThinking}
          onSuggestionClick={handleSuggestionClick}
          chatEndRef={chatEndRef}
        />

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          disabled={isThinking}
          placeholder={docs.length > 0 ? "Ask a research question..." : "Upload PDFs to begin..."}
        />
      </main>
    </div>
  );
}

