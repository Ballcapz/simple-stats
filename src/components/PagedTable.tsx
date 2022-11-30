import { Pagination, Table } from "@mantine/core";
import { Drill, Player, Stat } from "@prisma/client";

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
    <div className="flex flex-col">
      <Pagination page={page} onChange={setPage} total={totalPages} withEdges />
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((thVal, i) => (
              <th key={i}>{thVal}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((element) => (
            <tr key={element.id}>
              <td>{element.drill.name}</td>
              <td>{element.player.name}</td>
              <td>{element.leftMakes}</td>
              <td>{element.leftTakes}</td>
              <td>{element.rightMakes}</td>
              <td>{element.rightTakes}</td>
              <td>{element.totalMakes}</td>
              <td>{element.totalTakes}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PagedTable;
