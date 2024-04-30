import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
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
            data: { username, email, hasTag: false, capturedTags: [] },
          });
        }
      } catch (error) {
        console.error("addUser error!", error);
        return { success: false, error };
      }
    }),
  updateUsers: protectedProcedure
    .input(
      z.object({
        prevName: z.string(),
        nextName: z.string(),
        capturedId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prevName, nextName, capturedId } = input;
      try {
        const user1 = await ctx.prisma.user
          .findUnique({
            where: { username: prevName },
          })
          .then((res) => res?.username);

        const user2 = await ctx.prisma.user
          .findUnique({
            where: { username: nextName },
          })
          .then((res) => res?.username);

        if (user1) {
          // Checks if user2 exists for first post flow
          const updateUser1 = await ctx.prisma.user.update({
            where: {
              username: user1,
            },
            data: !user2
              ? {
                  hasTag: true,
                  capturedTags: {
                    push: capturedId,
                  },
                }
              : {
                  hasTag: false,
                },
          });

          if (user2) {
            const updateUser2 = await ctx.prisma.user.update({
              where: {
                username: user2,
              },
              data: {
                hasTag: true,
                capturedTags: {
                  push: capturedId,
                },
              },
            });
            return { updateUser1, updateUser2 };
          }

          return { updateUser1 };
        }

        return null;
      } catch (error) {
        console.error("updateUsers error!", error);
        return { error };
      }
    }),
});
