'use client';

import Groq from 'groq-sdk';

export async function generateRAGResponse(
  query: string, 
  context: string,
  history: { role: 'user' | 'assistant', text: string }[]
): Promise<string> {
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured. Please set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file.');
  }

  // Create a new Groq client instance
  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemMessage = `You are a world-class Research Assistant. 
Use the provided DOCUMENT CONTEXT to answer the user's question accurately.
If the answer is not in the context, state that you don't have enough information.
Keep your answer professional, precise, and well-formatted with markdown.

Always cite specific parts of the context where applicable.`;

  // Build messages array for chat completion
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content: systemMessage,
    },
    {
      role: 'user',
      content: `DOCUMENT CONTEXT:
${context}

${history.length > 0 ? `CHAT HISTORY:\n${history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')}\n\n` : ''}USER QUESTION:
${query}`,
    },
  ];

  try {
    // Use llama-3.3-70b-versatile as primary model - fast and capable
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.2,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Groq API Error, attempting fallback:", error);
    
    // Check if it's a quota/rate limit error
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('rate limit')) {
      throw new Error(`Rate limit exceeded. Please retry after some time. Groq has rate limits - you may need to wait or check your usage.`);
    }
    
    // If it's a model not found error, try fallback
    if (error?.status === 404 || error?.code === 404 || error?.message?.includes('404') || error?.message?.includes('not found')) {
      try {
        // Fallback to llama-3.1-8b-instant - faster, smaller model
        const fallbackCompletion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          temperature: 0.2,
          max_tokens: 2048,
        });

        return fallbackCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      } catch (fallbackError: any) {
        throw new Error(`Model not found. Please check your API key has access to available models. Error: ${fallbackError?.message || error?.message || 'Unknown model error'}`);
      }
    }
    
    // Handle API key errors
    if (error?.message?.includes('API key') || error?.message?.includes('Invalid API key') || error?.message?.includes('Unauthorized') || error?.status === 401) {
      throw new Error('Invalid API key. Please check your NEXT_PUBLIC_GROQ_API_KEY in .env.local');
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

