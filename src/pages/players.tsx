import { useSession } from "next-auth/react";
import { useState } from "react";
import { MyLink } from "../components/MyLink";
import { trpc } from "../utils/trpc";

const ExistingPlayers = () => {
  const { data: players, isLoading } = trpc.players.getAll.useQuery();

  if (isLoading) return <div>Fetching Players...</div>;

  return (
    <div className="flex flex-col gap-1">
      {players?.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  );
};

const Form = () => {
  const [player, setPlayer] = useState("");
  const postMessage = trpc.players.postMessage.useMutation();

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postMessage.mutate({
          name: player,
        });
        setPlayer("");
      }}
    >
      <input
        type="text"
        value={player}
        placeholder="New player..."
        minLength={1}
        maxLength={100}
        onChange={(event) => setPlayer(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-100 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Add new Player
      </button>
    </form>
  );
};

const Players = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Add New Players</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <MyLink href="/">Home</MyLink>
              <div className="pt-6">
                <Form />
                <h2 className="my-2 text-xl underline">Existing players:</h2>
                <ExistingPlayers />
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

export default Players;
