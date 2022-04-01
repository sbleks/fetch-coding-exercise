import { ActionFunction, json, LoaderFunction } from "remix";
import { getBalances } from "~/models/transactions.server";

export const loader: LoaderFunction = async () => {
  const balances = await getBalances();
  return json(balances);
};

export const action: ActionFunction = async ({ request }) => {
  const balances = await getBalances();
  return json(balances);
};
