import { ActionFunction } from "remix";
import { clearDB } from "~/transactions.server";

export const action: ActionFunction = async () => {
  await clearDB();
  return new Response("Database cleared", { status: 200 });
};
