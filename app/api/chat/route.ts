import { NextRequest, NextResponse } from 'next/server';
import { streamChat, generateResponse } from '@/lib/mistral-api';
import { saveConversation } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, streaming = false } = await req.json();

    if (streaming) {
      const stream = await streamChat(messages);
      return new NextResponse(stream as any, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const response = await generateResponse(messages);
      
      // Save conversation to Supabase if userId is provided
      if (userId) {
        await saveConversation(userId, [...messages, response.choices[0].message]);
      }

      return NextResponse.json({
        role: 'assistant',
        content: response.choices[0].message.content,
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
