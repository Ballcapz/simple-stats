import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import PagedTable from "../components/PagedTable";
import { useState } from "react";
import { MyLink } from "../components/MyLink";

const PAGE_SIZE = 25;

const ExistingStats = () => {
  const [page, setPage] = useState(0);

  const { data: stats, isLoading } = trpc.stats.getPaged.useQuery({
    pageSize: PAGE_SIZE,
    currentPage: page,
  });
  const { data: count, isLoading: countLoading } =
    trpc.stats.getTotalCount.useQuery();

  if (isLoading && countLoading) return <div>Fetching stats...</div>;

  return (
    <PagedTable
      page={page + 1}
      setPage={(num) => setPage(num - 1)}
      totalPages={Math.max(Math.round(count ?? 0 / PAGE_SIZE), 1)}
      tableData={stats}
      tableHeaders={[
        "Drill",
        "Player",
        "Makes (L)",
        "Takes (L)",
        "Makes (R)",
        "Takes (R)",
        "Makes (T)",
        "Takes (T)",
      ]}
    />
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
              <MyLink href="/">Home</MyLink>
              <div className="pt-6">
                <h2 className="my-2 text-xl underline">Stat summary:</h2>
                <ExistingStats />
              </div>
            </>
          ) : (
            <MyLink href="/">Home</MyLink>
          )}
        </div>
      </div>
    </main>
  );
};

export default Stats;
