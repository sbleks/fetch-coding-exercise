# Fetch Rewards Coding Exercise

## Running the service on your local machine

To run this project locally, you need to have [NodeJS](https://nodejs.dev/) version 14 or higher and [npm](https://npmjs.com/) installed on your machine.

After you clone the repository and navigate into the project's folder, let's get the necessary packages installed by running:

```
npm install
```

To make sure everything is set up correctly and the database is cleared out, run:

```
npm run setup
```

Now you are ready to start the development server! Go ahead and run

```
npm run dev
```

## Adding transactions

```
https://localhost:3000/api/add
```

The add API takes a POST request with JSON transactions that have a payer, points, and optional timestamp.

Examples:

### A single transaction

```json
{ "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
```

### An array of transactions

```json
[
  { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
  { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
  { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
  {
    "payer": "MILLER COORS",
    "points": 10000,
    "timestamp": "2020-11-01T14:00:00Z"
  },
  { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }
]
```

## Spending Points

```
https://localhost:3000/api/spend
```

The spend API takes a POST request with a JSON object containing the amount of points you would like to spend. The API will either return an array of JSON transactions or an error if you do not have enough points to complete the spend.

### Example Spend Data

```json
{ "points": 5000 }
```

### Example Spend Response

```json
[
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
]
```

## Getting Balances

```
https://localhost:3000/api/balances
```

The balances API takes a POST request and returns the balances of each payer.

### Example Response

```json
{
  "DANNON": 1000,
  "MILLER COORS": 5300,
  "UNILEVER": 0
}
```

## Additional Helper APIs

### Clear Database

```
https://localhost:3000/api/clear
```

### Seed Database

```
https://localhost:3000/api/seed
```

This API clears the database and adds the example transactions to add.
