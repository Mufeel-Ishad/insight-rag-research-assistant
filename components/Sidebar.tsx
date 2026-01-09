'use client';

import { DocumentSource } from '@/types';
import { IconPlus, IconFile, IconTrash } from './icons';

interface SidebarProps {
  docs: DocumentSource[];
  isProcessing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDoc: (id: string) => void;
}

export default function Sidebar({ docs, isProcessing, onFileUpload, onRemoveDoc }: SidebarProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <aside className="w-80 border-r border-neutral-900 flex flex-col bg-black/50 backdrop-blur-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold from-cyan-500 to-slate-900 bg-gradient-to-r bg-clip-text text-transparent">Insight-RAG</h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-semibold">Research Assistant</p>
      </div>

      <div className="px-4 mb-4">
        <label className="flex items-center justify-center gap-2 w-full p-3 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-xl cursor-pointer shadow-lg shadow-black/20">
          <IconPlus />
          <span className="font-medium">Upload Research PDFs</span>
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={onFileUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Library ({docs.length})</h2>
          {isProcessing && (
            <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className="group relative bg-neutral-900/40 border border-neutral-800/60 rounded-lg p-3 hover:border-neutral-600 transition-all">
              <div className="flex items-start gap-3">
                <div className="text-neutral-400 mt-0.5">
                  <IconFile />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate pr-6 text-neutral-200">{doc.name}</p>
                  <p className="text-[10px] text-neutral-500">{formatFileSize(doc.size)}</p>
                </div>
                <button
                  onClick={() => onRemoveDoc(doc.id)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
          {docs.length === 0 && !isProcessing && (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 text-neutral-600 mb-3">
                <IconFile />
              </div>
              <p className="text-sm text-neutral-600">No documents yet</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

