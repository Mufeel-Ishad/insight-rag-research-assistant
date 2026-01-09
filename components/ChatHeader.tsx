export default function ChatHeader() {
  return (
    <header className="h-16 border-b border-neutral-900 flex items-center px-8 bg-black/50 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-medium text-neutral-300">Agent Insight Ready</span>
      </div>
    </header>
  );
}

