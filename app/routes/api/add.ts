import { ActionFunction, json } from "remix";
import { addTransaction } from "~/models/transactions.server";

export const action: ActionFunction = async ({ request }) => {
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!data) return new Response("Invalid data", { status: 400 });
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
