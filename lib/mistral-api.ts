import { AIModel } from '@/types/settings'
import { MistralClient } from '@mistralai/mistralai';

const client = new MistralClient(process.env.MISTRAL_API_KEY!);

export async function streamChat(messages: any[]) {
  try {
    const chatStream = await client.chatStream({
      model: 'mistral-medium',
      messages: messages,
    });

    return chatStream;
  } catch (error) {
    console.error('Error in Mistral API:', error);
    throw error;
  }
}

export async function generateResponse(messages: any[]) {
  try {
    const response = await client.chat({
      model: 'mistral-medium',
      messages: messages,
    });

    return response;
  } catch (error) {
    console.error('Error in Mistral API:', error);
    throw error;
  }
}
