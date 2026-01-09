'use client';

import { ChatMessage } from '@/types';
import { marked } from 'marked';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const renderMessageContent = () => {
    if (message.role === 'user') {
      return <div className="whitespace-pre-wrap">{message.text}</div>;
    }
    
    // Parse markdown to HTML
    const htmlContent = marked.parse(message.text, { async: false }) as string;
    
    return (
      <div 
        className="prose prose-invert prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-6 py-4 ${
        message.role === 'user' 
          ? 'bg-neutral-800 text-white shadow-lg shadow-black/30' 
          : 'bg-neutral-950 border border-neutral-800 text-neutral-200'
      }`}>
        {renderMessageContent()}
      </div>
    </div>
  );
}

