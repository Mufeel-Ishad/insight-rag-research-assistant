'use client';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mb-6 text-indigo-500 border border-indigo-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-200">Hello, I'm your Research Assistant</h2>
      <p className="text-slate-500 mt-2 max-w-md">
        Upload your research papers, technical documents, or PDFs and ask me complex questions about their content.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
        <div 
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-indigo-500/50 transition-colors cursor-pointer" 
          onClick={() => onSuggestionClick("Summarize the key findings of all uploaded documents.")}
        >
          <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Summarize</p>
          <p className="text-sm text-slate-400">"What are the core conclusions in these papers?"</p>
        </div>
        <div 
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-indigo-500/50 transition-colors cursor-pointer" 
          onClick={() => onSuggestionClick("Find contradictions or conflicting data points across the sources.")}
        >
          <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Analyze</p>
          <p className="text-sm text-slate-400">"Are there any conflicting data points?"</p>
        </div>
      </div>
    </div>
  );
}

