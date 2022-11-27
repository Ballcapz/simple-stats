import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const drillsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.drill.findMany();
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
        await ctx.prisma.drill.create({
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
