import {
  ActionFunction,
  Form,
  json,
  Link,
  useActionData,
  useTransition,
} from "remix";
import { addTransaction, isJson } from "~/models/transactions.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    const formData = await request.formData();
    const JSONdata = await formData.get("addPoints")?.toString();
    if (!JSONdata) {
      throw new Error("No data was sent");
    }
    if (!isJson(JSONdata)) {
      throw new Error("You did not send data as a JSON object");
    }
    const data = JSON.parse(JSONdata);
    if (!Array.isArray(data)) {
      const dataArray = [data];
      const createdTransactions = await addTransaction(dataArray);
      return json(createdTransactions);
    }
    if (Array.isArray(data)) {
      const createdTransactions = await addTransaction(data);
      return json(createdTransactions);
    }
  }

  if (request.headers.get("Content-Type") === "application/json") {
    throw new Response("", {
      status: 400,
    });
  }
};

function AddPointsForm() {
  const transition = useTransition();
  return (
    <Form method="post">
      <label
        htmlFor="add-points"
        className="mb-2 block font-medium text-gray-900"
      >
        Transactions to add
      </label>
      <textarea
        id="add-points"
        rows={8}
        cols={50}
        name="addPoints"
        required
        className="mb-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder='{ payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" }'
      ></textarea>

      <button
        type="submit"
        disabled={transition.state === "loading"}
        className="mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        {transition.state === "loading" ? (
          <>
            <svg
              role="status"
              className="mr-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Submitting...
          </>
        ) : (
          "Add Points"
        )}
      </button>
    </Form>
  );
}

export default function AddPoints() {
  const data = useActionData();
  return data ? (
    <div className="">
      <pre className="mb-4 rounded-lg bg-gray-50 p-6 outline outline-gray-300">
        {JSON.stringify(data, null, 2)}
      </pre>
      <Link
        to="."
        className="mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Add more points
      </Link>
    </div>
  ) : (
    <AddPointsForm />
  );
}
