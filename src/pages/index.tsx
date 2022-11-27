import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FormNew } from "../components/StatForm";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Stats Collector</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <div className="flex items-center justify-evenly">
                <p>Hi {session.user?.name}</p>
                <button
                  className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  className="mt-2 mr-1 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                  href="/drills"
                >
                  Manage Drills
                </Link>
                <Link
                  className="mt-2 ml-1 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                  href="/players"
                >
                  Manage Players
                </Link>
              </div>
              <div className="my-2 flex items-center justify-center">
                <Link
                  className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                  href="/stats"
                >
                  See Stats Summary
                </Link>
              </div>
              <div className="pt-2">
                <FormNew />
              </div>
            </>
          ) : (
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
              onClick={() => signIn("discord")}
            >
              Login with Discord
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
