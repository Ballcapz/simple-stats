import Link from "next/link";

export const MyLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => {
  return (
    <Link
      className="mt-2 mr-1 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white duration-150 hover:bg-indigo-700 active:shadow-lg"
      href={href}
    >
      {children}
    </Link>
  );
};
