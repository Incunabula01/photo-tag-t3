import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

import { storage, ref, uploadBytes, getDownloadURL } from "../../../server";
// import { storage,  ref,  uploadBytes, getDownloadURL} from '@photo-tag/server';

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: parseInt(input, 10) } });
  }),
  saveImageToFirebase: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { file } = input;
      const metadata = {
        contentType: "image/jpg",
      };

      try {
        const assetRes = await fetch(file);
        const assetBlob: Blob = await assetRes.blob();

        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 9000) + 1000;
        const imageId = parseInt(`${timestamp}${random}`, 10);

        const storageRef = ref(storage, `tag-image-${imageId}.jpg`);

        const snapshot = await uploadBytes(storageRef, assetBlob, metadata);
        console.log("Uploaded a blob or file!", snapshot);
        const imageUrl = await getDownloadURL(snapshot.ref);
        console.log("image url", imageUrl);

        return { success: true, imgUrl: imageUrl };
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
        userId: z.string(),
        imageUrl: z.string(),
        createdAt: z.coerce.date(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log("create post", input);

      return ctx.prisma.post.create({ data: input });
    }),
});
