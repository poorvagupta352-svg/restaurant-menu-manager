import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Dish } from "@prisma/client";

export const publicRouter = createTRPCRouter({
  getRestaurantMenu: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.restaurantId },
        include: {
          categories: {
            orderBy: { name: "asc" },
            include: {
              dishes: {
                include: {
                  dish: {
                    include: {
                      categories: {
                        include: {
                          category: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      const menuData = {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          location: restaurant.location,
        },
        categories: restaurant.categories.map((category) => ({
          id: category.id,
          name: category.name,
          dishes: category.dishes.map((dc) => {
            const dish = dc.dish as unknown as Dish & {
              price: number | null;
              isVegetarian: boolean;
              categories: Array<{
                category: { id: string; name: string };
              }>;
            };
            return {
              id: dish.id,
              name: dish.name,
              description: dish.description,
              imageUrl: dish.imageUrl,
              spiceLevel: dish.spiceLevel,
              price: dish.price ?? null,
              isVegetarian: dish.isVegetarian ?? true,
              categories: dish.categories.map((dcc) => ({
                id: dcc.category.id,
                name: dcc.category.name,
              })),
            };
          }),
        })),
      };

      return menuData;
    }),
});
