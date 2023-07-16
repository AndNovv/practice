import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sanatoriumRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ name: z.string(), description: z.string(), location: z.string(), price: z.number(), treatmentProfiles: z.array(z.string()) }))
        .mutation(async ({ input: { name, description, location, price, treatmentProfiles }, ctx }) => {
            const sanatorium = await ctx.prisma.sanatorium.create({
                data: {
                    name: name,
                    description: description,
                    location: location,
                    price: price,
                    treatmentProfiles: {
                        connect: treatmentProfiles.map((name) => ({ name })),
                    },
                },
                select: {
                    id: true,
                }
            })
            return sanatorium
        }),

    update: publicProcedure
        .input(z.object({ id: z.string(), name: z.string(), description: z.string(), location: z.string(), price: z.number() }))
        .mutation(async ({ input: { id, name, description, location, price }, ctx }) => {
            const sanatorium = await ctx.prisma.sanatorium.update({
                where: {
                    id
                },
                data: {
                    name: name,
                    description: description,
                    location: location,
                    price: price,
                },
            })
            return sanatorium
        }),

    updateTreatments: publicProcedure
        .input(z.object({ id: z.string(), treatmentProfiles: z.array(z.string()) }))
        .mutation(async ({ input: { id, treatmentProfiles }, ctx }) => {
            const sanatorium = await ctx.prisma.sanatorium.update({
                where: {
                    id
                },
                data: {
                    treatmentProfiles: {
                        set: [],
                        connect: treatmentProfiles.map((name) => ({ name })),
                    },
                },
                select: {
                    name: true,
                    description: true,
                    location: true,
                    price: true,
                    treatmentProfiles: {
                        select: {
                            name: true,
                        }
                    },
                }
            })
            return sanatorium
        }),

    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.sanatorium.findMany({
                select: {
                    name: true,
                    description: true,
                    location: true,
                    price: true,
                    treatmentProfiles: {
                        select: {
                            name: true,
                        }
                    },
                }
            });
        }),


    // Used in index
    getMainInfo: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.sanatorium.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    location: true,
                    price: true,
                    rating: true,
                    treatmentProfiles: {
                        select: {
                            name: true,
                        }
                    },
                }
            });
        }),

    delete: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input: { name }, ctx }) => {
            const sanatorium = await ctx.prisma.sanatorium.delete({
                where: {
                    name
                }
            })
            return sanatorium
        }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input: { id }, ctx }) => {
            const sanatorium = await ctx.prisma.sanatorium.findUnique({
                where: {
                    id,
                },
                select: {
                    name: true,
                    description: true,
                    price: true,
                    location: true,
                    treatmentProfiles: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            })
            return sanatorium
        }),

});
