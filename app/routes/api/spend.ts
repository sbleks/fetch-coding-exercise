import { Transactions } from "@prisma/client";
import { ActionFunction, json } from "remix";
import {
  distributePoints,
  getSpendableTransactions,
  spendPoints,
} from "~/transactions.server";

type ResponseTransactions = Pick<Transactions, "payer" | "points">;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const pointsToSpend: number = data.points;
  const positiveTransactions = await getSpendableTransactions();
  const { remainingSpend, updatedTransactions } = await distributePoints({
    positiveTransactions,
    pointsToSpend,
  });

  if (remainingSpend > 0)
    return json(`Insufficient balance to spend ${data.points} points`, {
      status: 400,
    });

  await spendPoints(updatedTransactions);

  return updatedTransactions.map((transaction): ResponseTransactions => {
    const { payer, points } = transaction;
    const responseTransaction = { payer, points };
    return responseTransaction;
  });
};
