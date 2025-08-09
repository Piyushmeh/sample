import { initTRPC } from '@trpc/server';
import { supabase } from '@/lib/supabase';

export const createContext = async () => {
  return {
    supabase,
  };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
