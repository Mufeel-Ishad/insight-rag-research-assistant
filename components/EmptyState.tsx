'use client';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      <div className="w-20 h-20 bg-neutral-800/40 rounded-3xl flex items-center justify-center mb-6 text-neutral-400 border border-neutral-700/40">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-neutral-200">Hello, I'm your Research Assistant</h2>
      <p className="text-neutral-500 mt-2 max-w-md">
        Upload your research papers, technical documents, or PDFs and ask me complex questions about their content.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
        <div 
          className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-left hover:border-neutral-700 transition-colors cursor-pointer" 
          onClick={() => onSuggestionClick("Summarize the key findings of all uploaded documents.")}
        >
          <p className="text-xs text-neutral-300 font-bold uppercase mb-1">Summarize</p>
          <p className="text-sm text-neutral-400">"What are the core conclusions in these papers?"</p>
        </div>
        <div 
          className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl text-left hover:border-neutral-700 transition-colors cursor-pointer" 
          onClick={() => onSuggestionClick("Find contradictions or conflicting data points across the sources.")}
        >
          <p className="text-xs text-neutral-300 font-bold uppercase mb-1">Analyze</p>
          <p className="text-sm text-neutral-400">"Are there any conflicting data points?"</p>
        </div>
      </div>
    </div>
  );
}

