import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

const Dropdown = ({
  options,
  selected,
  setSelected,
  label,
}: {
  options: Array<string>;
  selected: string;
  setSelected: (value: string) => void;
  label: string;
}) => {
  return (
    <div className="relative mt-4 max-w-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 bottom-0 right-2.5 my-auto mt-9 h-6 w-6 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <label>{label}</label>
      <select
        className="w-full appearance-none rounded-md border bg-white p-2.5 text-gray-500 shadow-sm outline-none focus:border-indigo-600"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

const NumberInput = ({
  value,
  setValue,
  label,
}: {
  value: number;
  setValue: (value: number) => void;
  label: string;
}) => {
  return (
    <>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        min={0}
        onFocus={(e) => e.target.select()}
        onChange={(event) => {
          setValue(Number(event.target.value) ?? 0);
        }}
        className="rounded-md border-2 border-zinc-800 bg-neutral-100 px-4 py-2 focus:outline-none"
      />
    </>
  );
};

export const FormNew = () => {
  const { data: drills, isLoading } = trpc.drills.getAll.useQuery();
  const { data: players, isLoading: loadingPlayers } =
    trpc.players.getAll.useQuery();

  const postMessage = trpc.stats.postMessage.useMutation();

  const [selectedDrill, setSelectedDrill] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const [leftMakes, setLeftMakes] = useState(0);
  const [leftTakes, setLeftTakes] = useState(0);
  const [rightMakes, setRightMakes] = useState(0);
  const [rightTakes, setRightTakes] = useState(0);
  const [totalMakes, setTotalMakes] = useState(0);
  const [totalTakes, setTotalTakes] = useState(0);

  useEffect(() => {
    if (!isLoading && drills?.length && !selectedDrill.length) {
      setSelectedDrill(drills[0]?.name ?? "");
    }
    if (!loadingPlayers && players?.length && !selectedPlayer.length) {
      setSelectedDrill(players[0]?.name ?? "");
    }
  }, [isLoading, loadingPlayers, drills?.length, players?.length]);

  if (isLoading && loadingPlayers) return <div>Fetching data..</div>;

  return (
    <form
      className="mb-4 flex w-60 flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        const drillId =
          drills?.find(
            (drill) => drill.name.toLowerCase() === selectedDrill.toLowerCase()
          )?.id ?? "";
        const playerId =
          players?.find(
            (player) =>
              player.name.toLowerCase() === selectedPlayer.toLowerCase()
          )?.id ?? "";

        postMessage.mutate({
          leftMakes,
          leftTakes,
          rightMakes,
          rightTakes,
          totalMakes,
          totalTakes,
          drillId,
          playerId,
        });
        // intentionally not reseting the drill & player
        setLeftMakes(0);
        setLeftTakes(0);
        setRightMakes(0);
        setRightTakes(0);
        setTotalMakes(0);
        setTotalTakes(0);
      }}
    >
      <Dropdown
        options={
          drills && drills.length ? drills?.map((drill) => drill.name) : []
        }
        setSelected={(value: string) => setSelectedDrill(value)}
        selected={selectedDrill}
        label="Drill"
      />

      <Dropdown
        options={
          players && players.length ? players.map((player) => player.name) : []
        }
        setSelected={(value: string) => setSelectedPlayer(value)}
        selected={selectedPlayer}
        label="Player"
      />
      <NumberInput
        value={leftMakes}
        setValue={setLeftMakes}
        label="Left Makes"
      />
      <NumberInput
        value={leftTakes}
        setValue={setLeftTakes}
        label="Left Takes"
      />
      <NumberInput
        value={rightMakes}
        setValue={setRightMakes}
        label="Right Makes"
      />
      <NumberInput
        value={rightTakes}
        setValue={setRightTakes}
        label="Right Takes"
      />

      <NumberInput
        value={totalMakes}
        setValue={setTotalMakes}
        label="Total Makes"
      />
      <NumberInput
        value={totalTakes}
        setValue={setTotalTakes}
        label="Total Takes"
      />
      <button
        type="submit"
        className="mt-2 rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit Stats
      </button>
    </form>
  );
};
