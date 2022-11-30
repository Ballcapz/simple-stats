import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const playersRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.player.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.player.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }),
});
