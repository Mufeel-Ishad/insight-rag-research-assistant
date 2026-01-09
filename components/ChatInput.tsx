'use client';

import { IconSend } from './icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ value, onChange, onSubmit, disabled, placeholder }: ChatInputProps) {
  return (
    <div className="p-6 bg-gradient-to-t from-black via-black to-transparent">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto relative group">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-neutral-500/40 focus:border-neutral-500 transition-all shadow-2xl"
        />
        <button 
          type="submit"
          disabled={disabled}
          className="absolute right-3 top-3 bottom-3 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:bg-neutral-900 text-white rounded-xl transition-all"
        >
          <IconSend />
        </button>
      </form>
      <p className="text-[10px] text-center text-neutral-600 mt-4 uppercase tracking-widest font-bold">
        Insight RAG v1.0 • AI-Driven Research Extraction
      </p>
    </div>
  );
}

