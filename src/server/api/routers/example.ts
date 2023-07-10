import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello from ${input.text}`,
      };
    }),
  getSanatoriumCards: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sanatorium.findFirst();
  }),
});

export const treatmentRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input: { name }, ctx }) => {
      const treatment = await ctx.prisma.treatment.create({
        data: { name }
      })
      return treatment;
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const treatments = await ctx.prisma.treatment.findMany();
      return treatments;
    }),

  delete: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input: { name }, ctx }) => {
      const treatment = await ctx.prisma.treatment.delete({
        where: {
          name
        }
      })
      return treatment
    })
});
