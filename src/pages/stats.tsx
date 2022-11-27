import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const ExistingStats = () => {
  const { data: stats, isLoading } = trpc.stats.getAll.useQuery();

  if (isLoading) return <div>Fetching stats...</div>;

  return (
    <div className="flex flex-col gap-1">
      {stats?.map((stat) => (
        <div key={stat.id}>
          {stat.drillId} - {stat.playerId}: {stat.leftMakes} / {stat.leftTakes}{" "}
          | {stat.rightMakes} / {stat.rightTakes} | {stat.totalMakes} /{" "}
          {stat.totalTakes}
        </div>
      ))}
    </div>
  );
};

const Stats = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">See Stats</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <Link href="/">Home</Link>
              <div className="pt-6">
                <h2 className="my-2 text-xl underline">Stat summary:</h2>
                <ExistingStats />
              </div>
            </>
          ) : (
            <Link href="/">Home</Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default Stats;
