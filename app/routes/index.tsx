import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  return request.url;
};

export default function FetchLayout() {
  const data = useLoaderData();
  return (
    <main className="h-full bg-white px-2 py-6 sm:flex sm:justify-center sm:px-6">
      <div className="prose prose-orange">
        <h1 className="text-center">
          Welcome to the Fetch Rewards "Points" Coding Exercise
        </h1>
        <h2>Using the API:</h2>
        <p>
          You can interact with the API by sending a POST request to any of the
          end-points below.
        </p>
        <h3>Add Transactions</h3>
        <pre>{data}api/add</pre>
        <p>
          The add API expects a transaction or array of transactions in JSON
          format with a <span className="font-mono"> payer</span>,
          <span className="font-mono"> points</span>, and
          <span className="font-mono"> timestamp</span>.
        </p>
        <p>
          Timestamp will default to the current date and time if nothing is
          provided.
        </p>
        <h4>Example:</h4>
        <pre className="">
          {
            '{ "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }'
          }
        </pre>
        or
        <pre>{`[
  {
    "payer": "DANNON",
    "points": 900
  },
  {
    "payer": "MILLER COORS",
    "points": 100
  },
  {
    "payer": "UNILEVER",
    "points": 300
  }
]`}</pre>
        <h3>Spend Points</h3>
        <pre>{data}api/spend</pre>
        <p>
          The Spend Points endpoint expects data to be sent in JSON format with{" "}
          <span className="font-mono"> points</span>, and the number of points
          you would like to spend.
        </p>
        <h4>Example:</h4>
        <pre className="">{'{ "points": 5000 }'}</pre>
        <p>
          The API will respond with an array of the transactions that will be
          added from the spend.
        </p>
        <h4>Example Response:</h4>
        <pre>{`[
  {
    "payer": "DANNON",
    "points": -100
  },
  {
    "payer": "UNILEVER",
    "points": -200
  },
  {
    "payer": "MILLER COORS",
    "points": -4700
  }
]`}</pre>
        <p>
          If there are not enough points, a{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400"
            className="font-mono"
          >
            400 Bad Request
          </a>{" "}
          will be returned letting you know there is an insufficient point
          balance.
        </p>
        <h3>Get Balances</h3>
        <pre>{data}api/balances</pre>
        <p>The Get Balances endpoint does not expect any data.</p>
        <h4>Example Response:</h4>
        <pre>{`{
  "DANNON": 1000,
  "MILLER COORS": 5300,
  "UNILEVER": 0
}`}</pre>
        <h3>Additional Helper APIs</h3>
        <h4>Clear Database</h4>
        <pre>https://localhost:3000/api/clear</pre>
        <h4>Seed Database</h4>
        <pre>https://localhost:3000/api/seed</pre>
        <p>
          This API clears the database and adds the example transactions to add.
        </p>
      </div>
    </main>
  );
}
