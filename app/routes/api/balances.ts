import { ActionFunction, json } from "remix";
import { getBalances } from "~/transactions.server";

export const action: ActionFunction = async () => {
  const balances = await getBalances();
  return json(balances);
};
