# Fetch Rewards Coding Exercise

## Running the service on your local machine

To run this project locally, you need to have [NodeJS](https://nodejs.dev/) version 14 or higher and [npm](https://npmjs.com/) installed on your machine.

After you clone the repository and navigate into the project's folder, let's get the necessary packages installed by running:

```
npm install
```

To make sure everything is set up correctly, run:

```
npm run setup
```

Now you are ready to start the development server! Go ahead and run

```
npm run dev
```

Navigate your browser to `http://localhost:3000/` and follow the instructions to use the service!

## File Structure

This service is using [Remix](https://remix.run/) as its framework. Code for the lives in the `/app` directory.

This service has three API routes:

- Get Balances
- Add Points
- Spend Points

### Get Balances

The API for this lives at `/app/api/balances.ts`. This file exports an Action function that handles all incoming POST requests on the server. It uses `getBalances` to return the balances of all the payers in the database. `getBalances` lives in the `/app/models/transactions.server.ts` file which contains all the helper functions I have written for this service.

Note: Any file that ends in `.server.ts` lets Remix know that it should only live on the server and never be sent to the client.

### Add Points

The API for this lives at `/app/api/add.ts`. This API uses an Action function that handles all incoming POST requests on the server. This API parses the JSON data that is sent and adds the points to the database. The function validates that the incoming data is JSON and handles single point additions as well as multiple point additions as a JSON array.

### Spend Points

The API for this lives at `/app/api/spend.ts`. This API uses an Action function that handles all incoming POST requests on the server.

This API uses the `getTransactions` function to get all transactions from the database. It separates the positive and negative transactions into two arrays and subtracts the negative transactions from the positive using the rules in the exercise.

It then spends the requested amount of points against the remaining transactions that have a positive point value. If there are points left after each positive transaction has been spent to zero, an insufficient balance response is returned.

If all of the points were spent successfully, the function returns the negative transactions that it will add to the database.
