'use client';

// Dynamic import for PDF.js to ensure client-side only
let pdfjsLib: any;

async function getPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF processing is only available in the browser');
  }
  
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    // Initialize PDF.js worker
    const version = pdfjsLib.version || '3.11.174';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
  }
  
  return pdfjsLib;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

export function chunkText(text: string, size: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start += size - overlap;
  }

  return chunks;
}

