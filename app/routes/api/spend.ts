import { Transactions } from "@prisma/client";
import { ActionFunction, json } from "remix";
import {
  distributePoints,
  getSpendableTransactions,
  spendPoints,
} from "~/transactions.server";

type ResponseTransactions = Pick<Transactions, "payer" | "points">;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json().catch(() => {
    throw json("Invalid JSON", 400);
  });

  if (data.points <= 0) return json("Points spent must be greater than 0", 400);

  const spendableTransactions = await getSpendableTransactions();

  //distributePointsdetermines which transactions are spent and distrubutes the points to the remaining spendable transactions
  const { remainingSpend, updatedTransactions } = await distributePoints({
    spendableTransactions,
    pointsToSpend: data.points,
  });

  if (remainingSpend > 0)
    return json(`Insufficient balance to spend ${data.points} points`, 400);

  await spendPoints(updatedTransactions);

  return updatedTransactions.map((transaction): ResponseTransactions => {
    return { payer: transaction.payer, points: transaction.points };
  });
};
