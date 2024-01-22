import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
// import { Storage } from "@google-cloud/storage";

import { Storage, SignedPostPolicyV4Output } from "@google-cloud/storage";

const MAX_FILE_SIZE = 1000000; // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/heic"];

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
});

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: parseInt(input, 10) } });
  }),
  uploadBlobToGCS: protectedProcedure
    .input(z.object({ url: z.string(), file: z.string() }))
    .mutation(async ({ input }) => {
      const { url, file } = input;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const bucketName = process.env.PROJECT_ID;
        const objectName = "path/to/your/image.jpg";

        const imageUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;

        return { success: true, imageUrl };
      } catch (error) {
        console.error("Error:", error);
        return { success: false, error: "Internal Server Error" };
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        userId: z.number(),
        imageUrl: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
});
