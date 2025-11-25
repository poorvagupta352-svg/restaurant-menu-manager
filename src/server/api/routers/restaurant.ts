import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.create({
        data: {
          name: input.name,
          location: input.location,
          ownerId: ctx.userId,
        },
      });

      return restaurant;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const restaurants = await ctx.db.restaurant.findMany({
      where: { ownerId: ctx.userId },
      orderBy: { createdAt: "desc" },
    });

    return restaurants;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.userId,
        },
        include: {
          categories: {
            orderBy: { name: "asc" },
          },
          dishes: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      return restaurant;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const updated = await ctx.db.restaurant.update({
        where: { id: input.id },
        data: {
          name: input.name,
          location: input.location,
        },
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      await ctx.db.restaurant.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
