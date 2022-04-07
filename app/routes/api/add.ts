import { ActionFunction, json } from "remix";
import { addTransaction } from "~/transactions.server";

export const action: ActionFunction = async ({ request }) => {
  let data = await request.json().catch(() => {
    throw json("Invalid JSON", 400);
  });

  if (!data) return json("You did not send any transactions to add", 400);

  //If only one transaction is sent, put it into an array and add the transaction to the database. Otherwise the array of transactions is already in the correct format and can be added directly.
  if (!Array.isArray(data)) {
    const dataArray = [data];
    const createdTransactions = await addTransaction(dataArray);
    return json(createdTransactions);
  } else {
    const createdTransactions = await addTransaction(data);
    return json(createdTransactions);
  }
};
