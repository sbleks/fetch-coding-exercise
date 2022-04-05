import { prisma } from "~/db.server";

import type { Transactions } from "@prisma/client";

export async function getBalances() {
  const transactions = await prisma.transactions.groupBy({
    by: ["payer"],
    _sum: {
      points: true,
    },
  });

  const balances = transactions.map((transaction) => ({
    payer: transaction.payer,
    points: transaction._sum.points,
  }));

  return balances;
}

export async function addTransaction(transactions: Transactions[]) {
  const transactionPromises: Promise<Transactions>[] = [];
  transactions.map((transaction) => {
    return transactionPromises.push(
      prisma.transactions.create({
        data: transaction,
      })
    );
  });

  const transactionsCreated = await Promise.all(transactionPromises);
  return transactionsCreated;
}

export async function getTransactions() {
  const transactions = await prisma.transactions.findMany({
    orderBy: {
      timestamp: "asc",
    },
  });
  return transactions;
}

export async function spendPoints(updatedTransactions: Transactions[]) {
  const transactionPromises: Promise<Transactions>[] = [];
  updatedTransactions.map((transaction) => {
    return transactionPromises.push(
      prisma.transactions.create({
        data: {
          payer: transaction.payer,
          points: transaction.points,
        },
      })
    );
  });

  const addedTransactions = await Promise.all(transactionPromises);
  return addedTransactions;
}

export function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// export async function getSpendableTransactions() {
//   const transactions = await getTransactions();
//   const positiveTransactions = transactions.filter(
//     (transaction: Transactions) => transaction.points > 0
//   );
//   const negativeTransactions = transactions.filter(
//     (transaction: Transactions) => transaction.points < 0
//   );
//   negativeTransactions.forEach((negativeT) => {
//     let negPoints = negativeT.points;
//     let negPayer = negativeT.payer;
//     for (let positiveT of positiveTransactions) {
//       let posPayer = positiveT.payer;
//       if (posPayer === negPayer && positiveT.points > Math.abs(negPoints)) {
//         positiveT.points += negPoints;
//         negPoints = 0;
//         console.log(posPayer, positiveT.points, negPayer, negPoints);
//         return;
//       } else if (
//         posPayer === negPayer &&
//         positiveT.points < Math.abs(negPoints)
//       ) {
//         negPoints += positiveT.points;
//         positiveT.points = 0;
//         console.log(posPayer, positiveT.points, negPayer, negPoints);
//       }
//     }
//     if (negPoints === 0) return;
//   });
//   console.log("from spendable transactions", positiveTransactions);
//   return positiveTransactions;
// }
