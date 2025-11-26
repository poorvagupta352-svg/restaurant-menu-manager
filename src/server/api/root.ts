import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { restaurantRouter } from "~/server/api/routers/restaurant";
import { menuRouter } from "~/server/api/routers/menu";
import { publicRouter } from "~/server/api/routers/public";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  restaurant: restaurantRouter,
  menu: menuRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
