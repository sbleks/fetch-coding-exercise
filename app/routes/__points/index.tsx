import { Link } from "remix";

export default function PointsIndex() {
  return (
    <div className="prose">
      <h1 className="text-center">
        Welcome to the Fetch Rewards "Points" Coding Exercise
      </h1>
      <h2>Getting Started</h2>
      <p>
        To run this project locally, you need to have{" "}
        <a href="https://nodejs.dev/">NodeJS</a> version 14 or higher and{" "}
        <a href="https://npmjs.com">npm</a> installed on your machine.
      </p>
      <p>
        After you clone the repository and navigate into the project's folder,
        let's get the necessary packages installed by running:
      </p>
      <pre>npm install</pre>
      <p>To make sure everything is set up correctly, run:</p>
      <pre>npm run setup</pre>
      <p>Now you are ready to start the development server! Go ahead and run</p>
      <pre>npm run dev</pre>
      <h2>The Web Service</h2>
      <p>
        You should now have the development server running. There are two ways
        to interact with the Web Service, the GUI and the API.
      </p>
      <h3>Using the GUI:</h3>
      <p>You can interact with the GUI by clicking the links below:</p>
      <ul>
        <li>
          <Link to="/points/balances">Get Balances</Link>
        </li>
        <li>
          <Link to="/points/add">Add Points</Link>
        </li>
        <li>
          <Link to="/points/spend">Spend Points</Link>
        </li>
      </ul>
      <h3>Using the API:</h3>
      <p>
        You can interact with the API by sending a POST request to any of the
        end-points below.
      </p>
      <h4>Get Balances</h4>
      <pre>https://localhost:3000/api/balances</pre>
      <p>The Get Balances endpoint does not expect any data.</p>
      <h4>Add Points</h4>
      <pre>https://localhost:3000/api/add</pre>
      <p>
        The Add Points endpoint expects a transaction or array of transactions
        be sent in JSON format with a <span className="font-mono"> payer</span>,
        <span className="font-mono"> points</span>, and
        <span className="font-mono"> timestamp</span>.
      </p>
      <p>
        Timestamp will default to the current date and time if nothing is
        provided.
      </p>
      <h5>Example:</h5>
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
      <h4>Spend Points</h4>
      <pre>https://localhost:3000/api/spend</pre>
      <p>
        The Spend Points endpoint expects data to be sent in JSON format with{" "}
        <span className="font-mono"> points</span>, and the number of points you
        would like to spend.
      </p>
      <p>
        If there are not enough points, a{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400"
          className="font-mono"
        >
          400 Bad Request
        </a>{" "}
        will be returned letting you know there is an insufficient point balance
        to spend that amount of points.
      </p>
    </div>
  );
}
