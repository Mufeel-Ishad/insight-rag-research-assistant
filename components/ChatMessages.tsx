'use client';

import { ChatMessage } from '@/types';
import Message from './Message';
import EmptyState from './EmptyState';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSuggestionClick: (suggestion: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({ messages, isThinking, onSuggestionClick, chatEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && <EmptyState onSuggestionClick={onSuggestionClick} />}

        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}

        {isThinking && <ThinkingIndicator />}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

