import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
          dishes: category.dishes.map((dc) => ({
            id: dc.dish.id,
            name: dc.dish.name,
            description: dc.dish.description,
            imageUrl: dc.dish.imageUrl,
            spiceLevel: dc.dish.spiceLevel,
            price: dc.dish.price,
            isVegetarian: dc.dish.isVegetarian,
            categories: dc.dish.categories.map((dcc) => ({
              id: dcc.category.id,
              name: dcc.category.name,
            })),
          })),
        })),
      };

      return menuData;
    }),
});
