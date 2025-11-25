import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { getSessionFromRequest } from "~/server/auth";

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const session = await getSessionFromRequest(opts.req);
  
  return {
    db,
    session,
    req: opts.req,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      userId: ctx.session.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
