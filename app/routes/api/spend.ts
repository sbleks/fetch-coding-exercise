import { Transactions } from "@prisma/client";
import { ActionFunction, json } from "remix";
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
  //   console.log("positiveTransactions pre-spend", positiveTransactions);
  //   console.log("negativeTransactions pre-spend", negativeTransactions);
  negativeTransactions.forEach((negativeT) => {
    let negPayer = negativeT.payer;
    console.log("negtiveT", negativeT);
    for (let positiveT of positiveTransactions) {
      console.log("positiveT", positiveT);
      let posPayer = positiveT.payer;
      if (
        posPayer === negPayer &&
        positiveT.points >= Math.abs(negativeT.points)
      ) {
        positiveT.points += negativeT.points;
        negativeT.points = 0;
        // console.log(posPayer, positiveT.points, negPayer, negativeT.points);
        return;
      } else if (
        posPayer === negPayer &&
        positiveT.points <= Math.abs(negativeT.points)
      ) {
        negativeT.points += positiveT.points;
        positiveT.points = 0;
        // console.log(posPayer, positiveT.points, negPayer, negativeT.points);
      }
    }
    if (negativeT.points === 0) return;
  });
  //   console.log("positiveTransactions post-spend", positiveTransactions);
  //   console.log("negativeTransactions post-spend", negativeTransactions);

  let remainingSpend = data.points;
  let updatedTransactions: Transactions[] = [];

  positiveTransactions.map((transaction) => {
    if (remainingSpend === 0 || transaction.points === 0) return null;
    else if (transaction.points >= remainingSpend) {
      console.log(
        "start: remainingSpend",
        remainingSpend,
        "transaction",
        transaction
      );
      transaction.points -= remainingSpend;
      updatedTransactions.push({ ...transaction, points: -remainingSpend });
      remainingSpend = 0;
      console.log(
        "end: remainingSpend",
        remainingSpend,
        "transaction",
        transaction
      );
      return null;
    } else if (transaction.points <= remainingSpend) {
      console.log(
        "start: remainingSpend",
        remainingSpend,
        "transaction",
        transaction
      );
      remainingSpend -= transaction.points;
      updatedTransactions.push({ ...transaction, points: -transaction.points });
      transaction.points -= transaction.points;
      console.log(
        "end: remainingSpend",
        remainingSpend,
        "transaction",
        transaction
      );
    }
    return null;
  });
  //   console.log("positiveTransactions post-use-points", positiveTransactions);
  //   console.log("negativeTransactions post-use-points", negativeTransactions);
  if (remainingSpend > 0)
    return json(`Insufficient balance to spend ${data.points} points`, {
      status: 400,
    });
  const spentPoints = await spendPoints(updatedTransactions);
  console.log(spentPoints);

  return updatedTransactions.map((transaction): ResponseTransactions => {
    const { payer, points, timestamp } = transaction;
    const responseTransaction = { payer, points, timestamp };
    return responseTransaction;
  });
};
