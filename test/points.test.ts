import { Transactions } from "@prisma/client";
import {
  addTransaction,
  clearDB,
  distributePoints,
  getBalances,
  getSpendableTransactions,
  getTransactions,
  isJson,
  seedDB,
  spendPoints,
} from "~/transactions.server";

type ResponseTransactions = Pick<Transactions, "payer" | "points">;

const jsonPoints = `{ "points" : 5000 }`;

const transactionsToAdd = `[{ "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z"},
  { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
  { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
  { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
  { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }]`;

beforeAll(async () => {
  await clearDB();
});

afterAll(async () => {
  await clearDB();
});

describe("get balances", () => {
  it("get balances", async () => {
    await seedDB();
    const balances = await getBalances();
    expect(balances).toEqual({
      DANNON: 1100,
      "MILLER COORS": 10000,
      UNILEVER: 200,
    });
  });
});

describe("add transactions", () => {
  it("data is JSON", async () => {
    expect(isJson(transactionsToAdd)).toBe(true);
  });

  it("parse JSON", async () => {
    const data = JSON.parse(transactionsToAdd);
    expect(data.length).toBe(5);
  });

  it("add transactions", async () => {
    await clearDB();
    const data = JSON.parse(transactionsToAdd);
    await addTransaction(data);
    const transactions = await getTransactions();
    expect(transactions.length).toBe(5);
    expect(transactions).toEqual([
      { payer: "DANNON", points: 300 },
      { payer: "UNILEVER", points: 200 },
      { payer: "DANNON", points: -200 },
      {
        payer: "MILLER COORS",
        points: 10000,
      },
      { payer: "DANNON", points: 1000 },
    ]);
  });
});

describe("spend points", () => {
  it("data is JSON", async () => {
    expect(isJson(jsonPoints)).toBe(true);
  });

  it("parse JSON", async () => {
    const pointsToSpend = JSON.parse(jsonPoints);
    expect(pointsToSpend.points).toBe(5000);
  });

  it("spend 5000 points", async () => {
    await seedDB();
    const data = JSON.parse(jsonPoints);
    const pointsToSpend = data.points;
    const spendableTransactions = await getSpendableTransactions();
    const { remainingSpend, updatedTransactions } = await distributePoints({
      spendableTransactions,
      pointsToSpend,
    });
    const finalTransactions = updatedTransactions.map(
      (transaction): ResponseTransactions => {
        const { payer, points } = transaction;
        const responseTransaction = { payer, points };
        return responseTransaction;
      }
    );
    await spendPoints(updatedTransactions);
    expect(remainingSpend).toBe(0);
    expect(finalTransactions.length).toBe(3);
    expect(finalTransactions).toEqual([
      {
        payer: "DANNON",
        points: -100,
      },
      {
        payer: "UNILEVER",
        points: -200,
      },
      {
        payer: "MILLER COORS",
        points: -4700,
      },
    ]);
  });

  it("spend another 5000 points", async () => {
    const data = JSON.parse(jsonPoints);
    const pointsToSpend = data.points;
    const spendableTransactions = await getSpendableTransactions();
    const { remainingSpend, updatedTransactions } = await distributePoints({
      spendableTransactions,
      pointsToSpend,
    });
    const finalTransactions = updatedTransactions.map(
      (transaction): ResponseTransactions => {
        const { payer, points } = transaction;
        const responseTransaction = { payer, points };
        return responseTransaction;
      }
    );
    expect(remainingSpend).toBe(0);
    expect(finalTransactions.length).toBe(1);
    expect(finalTransactions).toEqual([
      {
        payer: "MILLER COORS",
        points: -5000,
      },
    ]);
  });

  it("no negative balances", async () => {
    await clearDB();
    const pointsToSpend = 5000;
    const spendableTransactions = await getSpendableTransactions();
    const { remainingSpend } = await distributePoints({
      spendableTransactions,
      pointsToSpend,
    });
    expect(remainingSpend).toBe(5000);
  });

  it("Use the api", async () => {
    await seedDB();
    const res = await fetch("http://localhost:3000/api/spend", {
      body: `{ "points": 5000 }`,
      method: "POST",
    });
    const spentTransactions = await res.json();
    expect(spentTransactions.length).toBe(3);
    expect(spentTransactions).toEqual([
      {
        payer: "DANNON",
        points: -100,
      },
      {
        payer: "UNILEVER",
        points: -200,
      },
      {
        payer: "MILLER COORS",
        points: -4700,
      },
    ]);
  });

  it("return not enough points", async () => {
    const res = await fetch("http://localhost:3000/api/spend", {
      body: `{ "points": 100000 }`,
      method: "POST",
    });
    const spentTransactions = await res.json();
    expect(spentTransactions).toBe(
      "Insufficient balance to spend 100000 points"
    );
  });

  it("return invalid json", async () => {
    const res = await fetch("http://localhost:3000/api/spend", {
      body: "hello",
      method: "POST",
    });
    const spentTransactions = await res.json();
    expect(res.status).toBe(400);
    expect(spentTransactions).toBe("Invalid JSON");
  });
});
