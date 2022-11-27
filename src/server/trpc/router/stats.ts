import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.stat.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }),
  getToday: protectedProcedure.query(async ({ ctx }) => {
    try {
      const tmp = Date.now() - 24 * 60 * 60 * 1000;
      const lastDay = new Date(tmp).toISOString();

      return await ctx.prisma.stat.findMany({
        where: {
          createdAt: {
            gte: lastDay,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        leftMakes: z.number(),
        leftTakes: z.number(),
        rightMakes: z.number(),
        rightTakes: z.number(),
        totalMakes: z.number(),
        totalTakes: z.number(),
        drillId: z.string(),
        playerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.stat.create({
          data: {
            leftMakes: input.leftMakes,
            leftTakes: input.leftTakes,
            rightMakes: input.rightMakes,
            rightTakes: input.rightTakes,
            totalMakes: input.totalMakes,
            totalTakes: input.totalTakes,
            userId: ctx.session.user.id,
            drillId: input.drillId,
            playerId: input.playerId,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),
});