import { signIn, signOut, useSession } from "next-auth/react";
import { MyLink } from "../components/MyLink";
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
                <MyLink href="/drills">Manage Drills</MyLink>
                <MyLink href="/players">Manage Players</MyLink>
              </div>
              <div className="my-2 flex items-center justify-center">
                <MyLink href="/stats">See Stats Summary</MyLink>
              </div>
              <div className="pt-2">
                <FormNew />
              </div>
            </>
          ) : (
            <>
              <button
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                onClick={() => signIn("discord")}
              >
                Login with Discord
              </button>
              <button
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
                onClick={() => signIn("google")}
              >
                Login with Google
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
