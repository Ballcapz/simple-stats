import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MyLink } from "../components/MyLink";
import { trpc } from "../utils/trpc";

const ExistingDrills = () => {
  const { data: drills, isLoading } = trpc.drills.getAll.useQuery();

  if (isLoading) return <div>Fetching Drills...</div>;

  return (
    <div className="flex flex-col gap-1">
      {drills?.map((drill) => (
        <div key={drill.id}>{drill.name}</div>
      ))}
    </div>
  );
};

const Form = () => {
  const [drill, setDrill] = useState("");
  const postMessage = trpc.drills.postMessage.useMutation();

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postMessage.mutate({
          name: drill,
        });
        setDrill("");
      }}
    >
      <input
        type="text"
        value={drill}
        placeholder="New Drill..."
        minLength={1}
        maxLength={100}
        onChange={(event) => setDrill(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-100 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Add new Drill
      </button>
    </form>
  );
};

const Drills = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Add New Drills</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <MyLink href="/">Home</MyLink>
              <div className="pt-6">
                <Form />
                <h2 className="my-2 text-xl underline">Existing drills:</h2>
                <ExistingDrills />
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

export default Drills;
