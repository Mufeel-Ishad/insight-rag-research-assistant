export default function ThinkingIndicator() {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs text-neutral-500 font-medium">Analyzing documents...</span>
      </div>
    </div>
  );
}

