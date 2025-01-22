import { NextRequest, NextResponse } from 'next/server';
import { generateMistralResponse } from '@/lib/mistral-api';
import { saveConversation } from '@/lib/supabase';
import { AIModel } from '@/types/settings';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, model = 'mistral-medium', streaming = false } = await req.json();

    const response = await generateMistralResponse(messages, model as AIModel);
    
    // Save conversation to Supabase if userId is provided
    if (userId) {
      await saveConversation(userId, [...messages, { role: 'assistant', content: response }]);
    }

    if (streaming) {
      return new NextResponse(response as any, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      return NextResponse.json({
        role: 'assistant',
        content: response,
      });
    }
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during chat' },
      { status: 500 }
    );
  }
}
