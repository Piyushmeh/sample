import { GoogleGenerativeAI } from '@google/generative-ai';
import { isImagePrompt } from '@/utils/promptDetection';

// Get API key from environment variables
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

export async function generateTextResponse(prompt: string): Promise<string> {
  try {
    // Check if API key is configured
    if (!apiKey || apiKey === 'your-api-key' || apiKey === 'your_actual_api_key_here' || apiKey.includes('your_')) {
      console.log('🔑 Gemini API key not configured, using fallback response');
      console.log('💡 To enable real AI responses, add your Gemini API key to .env.local');
      return getFallbackResponse(prompt);
    }

    console.log('🤖 Using Gemini API for text generation...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API response received successfully');
    return text;
  } catch (error) {
    console.error('❌ Error generating text response with Gemini:', error);
    return getFallbackResponse(prompt);
  }
}

export async function generateImageResponse(prompt: string): Promise<string> {
  try {
    // Check if API key is configured
    if (!apiKey || apiKey === 'your-api-key' || apiKey === 'your_actual_api_key_here' || apiKey.includes('your_')) {
      console.log('🔑 Gemini API key not configured, using fallback response');
      console.log('💡 To enable image generation, add your Gemini API key to .env.local');
      return getFallbackImageResponse(prompt);
    }

    console.log('🎨 Using Gemini API for image generation...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API image response received successfully');
    return text;
  } catch (error) {
    console.error('❌ Error generating image response with Gemini:', error);
    return getFallbackImageResponse(prompt);
  }
}

function getFallbackResponse(prompt: string): string {
  const responses = [
    `I'm here to help! This is a demo response since the AI API isn't configured yet. In a real setup, I would provide a detailed answer to: "${prompt}". To enable real AI responses, please add your Google Gemini API key to the .env.local file.`,
    `That's an interesting question about: "${prompt}"! This is currently running in demo mode. To get real AI responses, configure your Gemini API key in the environment variables.`,
    `Great question! I'd love to help with: "${prompt}". This is a demo response - the full AI integration would provide detailed insights. Add your Gemini API key to enable real responses.`,
    `I understand you're asking about: "${prompt}". This is a demo response - the full AI integration would provide detailed insights. Configure your API key for real AI responses.`,
    `Thanks for your message about: "${prompt}"! I'd love to help, but this is currently running in demo mode. Add your Gemini API key to get real AI responses.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function getFallbackImageResponse(prompt: string): string {
  return `I understand you'd like me to generate an image of: "${prompt}". In a production environment with proper API configuration, I would create a beautiful image based on your description. For now, this is a demo response. To enable image generation, please add your Google Gemini API key to the .env.local file.`;
}

export { isImagePrompt };
