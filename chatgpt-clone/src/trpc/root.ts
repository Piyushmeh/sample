import { router } from './context';
import { messageRouter } from './routers/message';

export const appRouter = router({
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
