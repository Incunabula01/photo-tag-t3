import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth.session;
  }),
  addUser: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { username, email } = input;

      try {
        const existingUser = await ctx.prisma.user
          .findUnique({
            where: { email },
          })
          .then((res) => (res?.username !== undefined ? true : false));

        if (!existingUser) {
          return ctx.prisma.user.create({
            data: { username, email, hasTag: false },
          });
        }
      } catch (error) {
        console.error("addUser error!", error);
        return { success: false, error };
      }
    }),
});
