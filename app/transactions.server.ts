import { prisma } from "~/db.server";
import type { Transactions } from "@prisma/client";

export async function getBalances() {
  const transactions = await prisma.transactions.groupBy({
    by: ["payer"],
    _sum: {
      points: true,
    },
  });

  let balances = {};
  transactions.forEach((transaction) => {
    balances = { ...balances, [transaction.payer]: transaction._sum.points };
  });

  return balances;
}

export async function addTransaction(transactions: Transactions[]) {
  //Prisma doesn't support createMany (bulk insert) with an SQLite database so I have to do it manually.
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
    select: {
      payer: true,
      points: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  return transactions;
}

export async function getFullTransactions() {
  const transactions = await prisma.transactions.findMany({
    orderBy: {
      timestamp: "asc",
    },
  });
  return transactions;
}

export async function getSpendableTransactions() {
  const transactions = await getFullTransactions();
  //I create two arrays to store the transactions with a positive points value and the transactions with a negative points value.
  const positiveTransactions = transactions.filter(
    (transaction: Transactions): boolean => transaction.points > 0
  );
  const negativeTransactions = transactions.filter(
    (transaction: Transactions) => transaction.points < 0
  );

  //Here I "spend" the points that are already in the transaction list to get only the transactions with points that are available to spend.
  negativeTransactions.forEach((negativeT) => {
    let negPayer = negativeT.payer;
    for (let positiveT of positiveTransactions) {
      let posPayer = positiveT.payer;
      if (
        posPayer === negPayer &&
        positiveT.points >= Math.abs(negativeT.points)
      ) {
        positiveT.points += negativeT.points;
        negativeT.points = 0;
        return;
      } else if (
        posPayer === negPayer &&
        positiveT.points <= Math.abs(negativeT.points)
      ) {
        negativeT.points += positiveT.points;
        positiveT.points = 0;
      }
    }
    if (negativeT.points === 0) return;
  });
  return positiveTransactions;
}

export async function distributePoints({
  pointsToSpend,
  spendableTransactions,
}: {
  pointsToSpend: number;
  spendableTransactions: Transactions[];
}) {
  let remainingSpend = pointsToSpend;
  let updatedTransactions: Transactions[] = [];

  //Here I distribute the points to the oldest transactions first making sure that none of the transactions are overspent. Once a spend occurs I add that transaction to the updatedTransactions array. Once all of the transactions have been updated I return the updatedTransactions array and the remainingSpend value. If there are remaining points returned the API will return an insufficient funds error.
  spendableTransactions.map((transaction) => {
    if (remainingSpend === 0 || transaction.points === 0) return null;
    else if (transaction.points >= remainingSpend) {
      transaction.points -= remainingSpend;
      updatedTransactions.push({ ...transaction, points: -remainingSpend });
      remainingSpend = 0;
      return null;
    } else if (transaction.points <= remainingSpend) {
      remainingSpend -= transaction.points;
      updatedTransactions.push({ ...transaction, points: -transaction.points });
      transaction.points -= transaction.points;
    }
    return null;
  });

  return { updatedTransactions, remainingSpend };
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

export async function clearDB() {
  await prisma.transactions.deleteMany({});
}

export async function seedDB() {
  await prisma.transactions.deleteMany({}).catch(() => {
    //This is here to prevent an error if the database is already empty.
  });
  await prisma.transactions.create({
    data: { payer: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z" },
  });
  await prisma.transactions.create({
    data: { payer: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z" },
  });
  await prisma.transactions.create({
    data: { payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" },
  });
  await prisma.transactions.create({
    data: {
      payer: "MILLER COORS",
      points: 10000,
      timestamp: "2020-11-01T14:00:00Z",
    },
  });
  await prisma.transactions.create({
    data: { payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z" },
  });
}
