import { ActionFunction, json } from "remix";
import { addTransaction } from "~/models/transactions.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  if (!Array.isArray(data)) {
    const dataArray = [data];
    const createdTransactions = await addTransaction(dataArray);
    return json(createdTransactions);
  }
  if (Array.isArray(data)) {
    const createdTransactions = await addTransaction(data);
    return json(createdTransactions);
  }
};
