import { ActionFunction } from "remix";
import { seedDB } from "~/transactions.server";

export const action: ActionFunction = async () => {
  await seedDB();
  return new Response("Database seeded", { status: 200 });
};
