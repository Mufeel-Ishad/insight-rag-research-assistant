'use client';

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRAGResponse(
  query: string, 
  context: string,
  history: { role: 'user' | 'assistant', text: string }[]
): Promise<string> {
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
  }

  // Create a new instance with the standard Google Generative AI package
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemInstruction = `You are a world-class Research Assistant. 
Use the provided DOCUMENT CONTEXT to answer the user's question accurately.
If the answer is not in the context, state that you don't have enough information.
Keep your answer professional, precise, and well-formatted with markdown.

Always cite specific parts of the context where applicable.`;

  // Flatten history and context into a single string for maximum compatibility
  const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
  
  const prompt = `DOCUMENT CONTEXT:
${context}

CHAT HISTORY:
${historyText}

USER QUESTION:
${query}`;

  try {
    // Use gemini-pro as primary model - it's the reliable free tier model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.2,
      },
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    return response.text() || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini Pro API Error, attempting fallback:", error);
    
    // Check if it's a quota/rate limit error
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
      throw new Error(`Rate limit exceeded. Please retry after some time. The free tier has daily limits - you may need to wait or check your usage.`);
    }
    
    // If it's a model not found error, try fallback
    if (error?.code === 404 || error?.status === 'NOT_FOUND' || error?.message?.includes('404')) {
      try {
        // Fallback to gemini-1.5-flash if available
        const fallbackModel = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash-lite',
          systemInstruction: systemInstruction,
          generationConfig: {
            temperature: 0.2,
          },
        });

        const fallbackResult = await fallbackModel.generateContent(prompt);

        const fallbackResponse = await fallbackResult.response;
        return fallbackResponse.text() || "I'm sorry, I couldn't generate a response.";
      } catch (fallbackError: any) {
        throw new Error(`Model not found. Please check your API key has access to available models. Error: ${fallbackError?.message || error?.message || 'Unknown model error'}`);
      }
    }
    
    // Handle API key errors
    if (error?.message?.includes('API key') || error?.message?.includes('Invalid API key')) {
      throw new Error('Invalid API key. Please check your NEXT_PUBLIC_GEMINI_API_KEY in .env.local');
    }
    
    throw new Error(`API Error: ${error?.message || 'Unknown error occurred. Please try again later.'}`);
  }
}

export async function retrieveRelevantContext(query: string, allChunks: string[]): Promise<string[]> {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
  
  const ranked = allChunks.map(chunk => {
    let score = 0;
    const lowerChunk = chunk.toLowerCase();
    queryTerms.forEach(term => {
      if (lowerChunk.includes(term)) score++;
    });
    // Phrase match bonus
    if (lowerChunk.includes(query.toLowerCase())) score += 10;
    return { chunk, score };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .filter(r => r.score > 0 || allChunks.length < 5)
    .slice(0, 6) 
    .map(r => r.chunk);
}

