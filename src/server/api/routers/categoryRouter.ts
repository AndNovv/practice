import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const categories = await ctx.prisma.category.findMany({
        where: {
          sanatoriumId: id,
        },
        orderBy: { order: "asc" },
        select: {
          title: true,
          content: true,
          style: true,
        },
      });
      return categories;
    }),

  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string(), order: z.number(), style: z.number(), sanatoriumId: z.string() }))
    .mutation(async ({ input: { title, content, order, style, sanatoriumId }, ctx }) => {
      const category = await ctx.prisma.category.create({
        data: {
          title,
          content,
          order,
          style,
          sanatorium: { connect: { id: sanatoriumId } },
        },
        select: {
          title: true,
          content: true,
          style: true,
        }
      })
      return category
    }),

});
