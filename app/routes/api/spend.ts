import { Transactions } from "@prisma/client";
import { ActionFunction } from "remix";
import { getTransactions, spendPoints } from "~/models/transactions.server";

type ResponseTransactions = Pick<
  Transactions,
  "payer" | "points" | "timestamp"
>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const transactions = await getTransactions();
  const positiveTransactions = transactions.filter(
    (transaction: Transactions) => transaction.points > 0
  );
  const negativeTransactions = transactions.filter(
    (transaction: Transactions) => transaction.points < 0
  );
  negativeTransactions.forEach((negativeT) => {
    let negPoints = negativeT.points;
    let negPayer = negativeT.payer;
    for (let positiveT of positiveTransactions) {
      let posPayer = positiveT.payer;
      if (posPayer === negPayer && positiveT.points > Math.abs(negPoints)) {
        positiveT.points += negPoints;
        negPoints = 0;
        console.log(posPayer, positiveT.points, negPayer, negPoints);
        return;
      } else if (
        posPayer === negPayer &&
        positiveT.points < Math.abs(negPoints)
      ) {
        negPoints += positiveT.points;
        positiveT.points = 0;
        console.log(posPayer, positiveT.points, negPayer, negPoints);
      }
    }
    if (negPoints === 0) return;
  });
  let remainingSpend = data.points;
  let updatedTransactions: Transactions[] = [];

  positiveTransactions.map((transaction) => {
    if (remainingSpend === 0) return null;
    else if (transaction.points > remainingSpend) {
      transaction.points -= remainingSpend;
      updatedTransactions.push({ ...transaction, points: -remainingSpend });
      remainingSpend = 0;
      return null;
    } else if (transaction.points < remainingSpend) {
      remainingSpend -= transaction.points;
      updatedTransactions.push({ ...transaction, points: -transaction.points });
      transaction.points -= transaction.points;
    }
    return null;
  });

  const spentPoints = await spendPoints(updatedTransactions);
  console.log(spentPoints);

  return updatedTransactions.map((transaction): ResponseTransactions => {
    const { payer, points, timestamp } = transaction;
    const responseTransaction = { payer, points, timestamp };
    return responseTransaction;
  });
};
