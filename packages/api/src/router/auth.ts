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
    .mutation(({ ctx, input }) => {
      const { username, email } = input;
      console.log("add user fired! Auth state:", username, email);

      try {
        const existingUser = ctx.prisma.user.findUnique({
          where: { email },
        });
        console.log("existingUser", existingUser === null);

        if (existingUser !== null) {
          ctx.prisma.user.create({
            data: { username, email, hasTag: false },
          });
          console.log("User Created!");
        }

        return { success: true, username };
      } catch (error) {
        console.error("addUser error!", error);
        return { success: false, error };
      }
    }),
});
