import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          restaurantId: input.restaurantId,
        },
      });

      return category;
    }),

  getCategories: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const categories = await ctx.db.category.findMany({
        where: { restaurantId: input.restaurantId },
        orderBy: { name: "asc" },
      });

      return categories;
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!category || category.restaurant.ownerId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const updated = await ctx.db.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return updated;
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!category || category.restaurant.ownerId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  createDish: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().url().optional(),
        spiceLevel: z.number().min(0).max(5).optional(),
        categoryIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      if (input.categoryIds.length > 0) {
        const categories = await ctx.db.category.findMany({
          where: {
            id: { in: input.categoryIds },
            restaurantId: input.restaurantId,
          },
        });

        if (categories.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some categories do not belong to this restaurant",
          });
        }
      }

      const dish = await ctx.db.dish.create({
        data: {
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          spiceLevel: input.spiceLevel,
          restaurantId: input.restaurantId,
          categories: {
            create: input.categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return dish;
    }),

  getDishes: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          ownerId: ctx.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const dishes = await ctx.db.dish.findMany({
        where: { restaurantId: input.restaurantId },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return dishes;
    }),

  updateDish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        imageUrl: z.string().url().optional().nullable(),
        spiceLevel: z.number().min(0).max(5).optional().nullable(),
        categoryIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!dish || dish.restaurant.ownerId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found",
        });
      }

      const updateData: {
        name?: string;
        description?: string;
        imageUrl?: string | null;
        spiceLevel?: number | null;
      } = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
      if (input.spiceLevel !== undefined) updateData.spiceLevel = input.spiceLevel;

      if (input.categoryIds !== undefined) {
        if (input.categoryIds.length > 0) {
          const categories = await ctx.db.category.findMany({
            where: {
              id: { in: input.categoryIds },
              restaurantId: dish.restaurantId,
            },
          });

          if (categories.length !== input.categoryIds.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Some categories do not belong to this restaurant",
            });
          }
        }

        await ctx.db.dishCategory.deleteMany({
          where: { dishId: input.id },
        });

        await ctx.db.dishCategory.createMany({
          data: input.categoryIds.map((categoryId) => ({
            dishId: input.id,
            categoryId,
          })),
        });
      }

      const updated = await ctx.db.dish.update({
        where: { id: input.id },
        data: updateData,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return updated;
    }),

  deleteDish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!dish || dish.restaurant.ownerId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found",
        });
      }

      await ctx.db.dish.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

