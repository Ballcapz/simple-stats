import { Pagination, Table, Flex, Stack, Spoiler, Badge } from "@mantine/core";
import type { Drill, Player, Stat } from "@prisma/client";

export type PagedTable = {
  page: number;
  setPage: (num: number) => void;
  totalPages: number;
  tableData: MyStat;
  tableHeaders: Array<string>;
};

export type MyStat =
  | (Stat & {
      drill: Drill;
      player: Player;
    })[]
  | undefined;

const PagedTable = ({
  page,
  setPage,
  totalPages,
  tableData,
  tableHeaders,
}: PagedTable) => {
  return (
    <Flex gap="sm" justify="center" align="center" direction="column">
      <Pagination page={page} onChange={setPage} total={totalPages} />
      <Stack align="center" justify="flex-start" spacing="sm">
        <Table striped>
          <thead>
            <tr>
              {tableHeaders.map((th, i) => (
                <th key={i}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row) => {
              const lPercent = Math.round(
                (row.leftMakes / row.leftTakes) * 100
              );
              const rPercent = Math.round(
                (row.rightMakes / row.rightTakes) * 100
              );
              const tPercent = Math.round(
                (row.totalMakes / row.totalTakes) * 100
              );

              return (
                <tr key={row.id}>
                  <td>{row.drill.name}</td>
                  <td>{row.player.name}</td>
                  <td>{isNaN(lPercent) ? "-" : `${lPercent}%`}</td>
                  <td>{isNaN(rPercent) ? "-" : `${rPercent}%`}</td>
                  <td>{isNaN(tPercent) ? "-" : `${tPercent}%`}</td>
                  <td>{row.createdAt.toDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Stack>
    </Flex>
  );
};

export default PagedTable;
