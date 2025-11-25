import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { generateVerificationCode } from "~/lib/utils";
import { sendVerificationCode } from "~/lib/email";
import { createSession, deleteSession } from "~/server/auth";
import { cookies } from "next/headers";

export const authRouter = createTRPCRouter({
  requestVerificationCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
        country: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { email: input.email },
        update: {
          fullName: input.fullName,
          country: input.country,
        },
        create: {
          email: input.email,
          fullName: input.fullName,
          country: input.country,
          emailVerified: false,
        },
      });

      const code = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await ctx.db.verificationCode.deleteMany({
        where: { email: input.email },
      });

      await ctx.db.verificationCode.create({
        data: {
          email: input.email,
          code,
          expiresAt,
        },
      });

      await sendVerificationCode(input.email, code);

      return { success: true };
    }),

  verifyCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = await ctx.db.verificationCode.findFirst({
        where: {
          email: input.email,
          code: input.code,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!verificationCode) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired verification code",
        });
      }

      const user = await ctx.db.user.update({
        where: { email: input.email },
        data: { emailVerified: true },
      });

      await ctx.db.verificationCode.delete({
        where: { id: verificationCode.id },
      });

      const sessionToken = await createSession(user.id);
      const cookieStore = await cookies();
      cookieStore.set("session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          country: user.country,
        },
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please register first.",
        });
      }

      const code = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await ctx.db.verificationCode.deleteMany({
        where: { email: input.email },
      });

      await ctx.db.verificationCode.create({
        data: {
          email: input.email,
          code,
          expiresAt,
        },
      });

      await sendVerificationCode(input.email, code);

      return { success: true };
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        country: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    
    if (sessionToken) {
      await deleteSession(sessionToken);
      cookieStore.delete("session_token");
    }

    return { success: true };
  }),
});
