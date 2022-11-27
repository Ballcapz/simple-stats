import { router } from "../trpc";
import { authRouter } from "./auth";
import { statsRouter } from "./stats";
import { drillsRouter } from "./drills";
import { playersRouter } from "./players";

export const appRouter = router({
  stats: statsRouter,
  auth: authRouter,
  drills: drillsRouter,
  players: playersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
