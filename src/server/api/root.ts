import { categoryRouter } from "~/server/api/routers/categoryRouter";
import { treatmentRouter } from "~/server/api/routers/treatmentRouter";
import { sanatoriumRouter } from "~/server/api/routers/sanatoriumRouter";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  treatment: treatmentRouter,
  sanatorium: sanatoriumRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
