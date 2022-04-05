import { ActionFunction, json, LoaderFunction, useLoaderData } from "remix";
import { getBalances } from "~/models/transactions.server";

export const loader: LoaderFunction = async () => {
  const balances = await getBalances();
  return json(balances);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    throw new Response("", {
      status: 400,
    });
  }
  const balances = await getBalances();
  return json(balances);
};

export default function PointBalances() {
  const data = useLoaderData();
  return <pre className="">{JSON.stringify(data, null, 2)}</pre>;
}
