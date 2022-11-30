import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import PagedTable, { MyStat } from "../components/PagedTable";
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
        "Date",
      ]}
    />
  );
};

const Stats = () => {
  const { data: session, status } = useSession();
  const { data: allStats, isLoading } = trpc.stats.getAll.useQuery();
  const { data: todaysStat, isLoading: loadingToday } =
    trpc.stats.getToday.useQuery();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  function downloadCsv(stats: MyStat, fileName: string) {
    if (isLoading || loadingToday) {
      alert("Please try again");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const headerRow =
      [
        "Drill",
        "Player",
        "Makes (L)",
        "Takes (L)",
        "Makes (R)",
        "Takes (R)",
        "Makes (T)",
        "Takes (T)",
        "Date",
      ].join(",") + "\n";
    csvContent = csvContent + headerRow;

    stats?.forEach((singleRow) => {
      const drillName = singleRow.drill.name;
      const playerName = singleRow.player.name;

      const row = `${drillName},${playerName},${singleRow.leftMakes},${singleRow.leftTakes},${singleRow.rightMakes},${singleRow.rightTakes},${singleRow.totalMakes},${singleRow.totalTakes},${singleRow.createdAt}\n`;
      csvContent = csvContent + row;
    });

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Required for FF

    link.click();

    // document.removeChild(link);
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Stats Summary</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <MyLink href="/">Home</MyLink>
              <button
                title="Download all stats as a csv"
                className="mt-2 mr-1 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                onClick={() => downloadCsv(allStats, "all_stats.csv")}
              >
                Download All Stats
              </button>
              <button
                title="Download stats for the last 24 hours as a csv"
                className="mt-2 mr-1 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                onClick={() =>
                  downloadCsv(
                    todaysStat,
                    `stats_${new Date().toDateString()}.csv`
                  )
                }
              >
                Download Today's Stats
              </button>
              <div className="pt-6">
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
