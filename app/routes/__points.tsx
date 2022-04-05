import { Link, Outlet } from "remix";

export default function FetchLayout() {
  return (
    <main className="h-full bg-white px-2 py-6 sm:flex sm:justify-center sm:px-6">
      <Outlet />
    </main>
  );
}
