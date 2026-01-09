export interface DocumentSource {
  id: string;
  name: string;
  content: string;
  chunks: string[];
  embeddings?: number[][];
  status: 'processing' | 'ready' | 'error';
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[]; // IDs or names of source documents used
  timestamp: number;
}

export interface RagResult {
  answer: string;
  relevantContext: string[];
}

