import { z } from 'zod';
import { router, publicProcedure } from '../context';
import { generateTextResponse, generateImageResponse, isImagePrompt } from '@/lib/gemini';

export const messageRouter = router({
  sendMessage: publicProcedure
    .input(z.object({
      content: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { content, userId } = input;
      
      // Generate AI response first
      let aiResponse: string;
      try {
        if (isImagePrompt(content)) {
          aiResponse = await generateImageResponse(content);
        } else {
          aiResponse = await generateTextResponse(content);
        }
      } catch (error) {
        console.error('Error generating AI response:', error);
        aiResponse = `I'm here to help! This is a demo response for: "${content}". In a production environment, I would provide a detailed AI-generated response.`;
      }

      // Try to store messages in database, but don't fail if it's not configured
      try {
        // Store user message
        const { data: userMessage, error: userError } = await ctx.supabase
          .from('messages')
          .insert({
            user_id: userId,
            content,
            role: 'user',
          })
          .select()
          .single();

        if (userError) {
          console.warn('Failed to store user message in database:', userError);
        }

        // Store AI response
        const { data: aiMessage, error: aiError } = await ctx.supabase
          .from('messages')
          .insert({
            user_id: userId,
            content: aiResponse,
            role: 'assistant',
          })
          .select()
          .single();

        if (aiError) {
          console.warn('Failed to store AI message in database:', aiError);
        }

        return {
          userMessage: userMessage || { id: Date.now().toString(), content, role: 'user', user_id: userId, created_at: new Date().toISOString() },
          aiMessage: aiMessage || { id: (Date.now() + 1).toString(), content: aiResponse, role: 'assistant', user_id: userId, created_at: new Date().toISOString() },
        };
      } catch (error) {
        console.warn('Database not configured, using fallback storage:', error);
        // Return fallback messages if database fails
        return {
          userMessage: { id: Date.now().toString(), content, role: 'user', user_id: userId, created_at: new Date().toISOString() },
          aiMessage: { id: (Date.now() + 1).toString(), content: aiResponse, role: 'assistant', user_id: userId, created_at: new Date().toISOString() },
        };
      }
    }),

  fetchMessages: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input, ctx }) => {
      const { userId, limit } = input;
      
      try {
        const { data: messages, error } = await ctx.supabase
          .from('messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(limit);

        if (error) {
          console.warn('Failed to fetch messages from database:', error);
          return [];
        }

        return messages || [];
      } catch (error) {
        console.warn('Database not configured, returning empty messages:', error);
        return [];
      }
    }),
});
