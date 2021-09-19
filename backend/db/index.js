const parse = require("pg-connection-string").parse;
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

class Client {
  constructor() {
    this.pool = null;
    this.client = null;
  }

  async init() {
    // Run the transactions in the connection pool
    const URI = {
      connectionString: process.env.CC_CONN_STR,
    };
    var connectionString;
    // Expand $env:appdata environment variable in Windows connection string
    if (URI.connectionString.includes("env:appdata")) {
      connectionString = await URI.connectionString.replace(
        "$env:appdata",
        process.env.APPDATA
      );
    }
    // Expand $HOME environment variable in UNIX connection string
    else if (URI.connectionString.includes("HOME")) {
      connectionString = await URI.connectionString.replace(
        "$HOME",
        process.env.HOME
      );
    } else {
      connectionString = URI.connectionString;
    }

    var config = parse(connectionString);
    config.port = 26257;
    config.database = "bank";

    this.pool = new Pool(config);

    // Connect to database
    this.client = await this.pool.connect();
    await this.client.query("USE classcaster");

    // // Callback
    // function cb(err, res) {
    //   if (err) throw err;

    //   if (res.rows.length > 0) {
    //     console.log("New account balances:");
    //     res.rows.forEach((row) => {
    //       console.log(row);
    //     });
    //   }
    // }

    // // Initialize table in transaction retry wrapper
    // console.log("Initializing accounts table...");
    // await retryTxn(0, 15, client, initTable, cb);

    // // Transfer funds in transaction retry wrapper
    // console.log("Transferring funds...");
    // await retryTxn(0, 15, client, transferFunds, cb);

    // // Delete a row in transaction retry wrapper
    // console.log("Deleting a row...");
    // await retryTxn(0, 15, client, deleteAccounts, cb);
  }

  async retryTxn(n, max, client, operation) {
    await client.query("BEGIN;");
    while (true) {
      n++;
      if (n === max) {
        throw new Error("Max retry count reached.");
      }

      try {
        const ret = await operation(client);
        await client.query("COMMIT;");
        return ret;
      } catch (err) {
        if (err.code !== "40001") {
          throw err;
        } else {
          console.log("Transaction failed. Retrying transaction.");
          console.log(err.message);
          await client.query("ROLLBACK;", () => {
            console.log("Rolling back transaction.");
          });
          await new Promise((r) => setTimeout(r, 2 ** n * 1000));
        }
      }
    }
  }

  async exec(operation, retries = 15) {
    return await this.retryTxn(0, retries, this.client, operation);
  }

  async getRows(text, values = []) {
    return (await this.client.query(text, values)).rows;
  }

  async get(text, values = []) {
    return (await this.getRows(text, values))[0];
  }

  async run(text, values, retries = 15) {
    const cb = (client) => client.query(text, values);
    return await this.exec(cb);
  }
}

module.exports = new Client();

/* // This function updates the values of two rows, simulating a "transfer" of funds.
async function transferFunds(client, callback) {
  const from = accountValues[0];
  const to = accountValues[1];
  const amount = 100;
  const selectFromBalanceStatement =
    "SELECT balance FROM accounts WHERE id = $1;";
  const selectFromValues = [from];
  await client.query(
    selectFromBalanceStatement,
    selectFromValues,
    (err, res) => {
      if (err) {
        return callback(err);
      } else if (res.rows.length === 0) {
        console.log("account not found in table");
        return callback(err);
      }
      var acctBal = res.rows[0].balance;
      if (acctBal < amount) {
        return callback(new Error("insufficient funds"));
      }
    }
  );

  const updateFromBalanceStatement =
    "UPDATE accounts SET balance = balance - $1 WHERE id = $2;";
  const updateFromValues = [amount, from];
  await client.query(updateFromBalanceStatement, updateFromValues, callback);

  const updateToBalanceStatement =
    "UPDATE accounts SET balance = balance + $1 WHERE id = $2;";
  const updateToValues = [amount, to];
  await client.query(updateToBalanceStatement, updateToValues, callback);

  const selectBalanceStatement = "SELECT id, balance FROM accounts;";
  await client.query(selectBalanceStatement, callback);
}

// This function deletes the third row in the accounts table.
async function deleteAccounts(client, callback) {
  const deleteStatement = "DELETE FROM accounts WHERE id = $1;";
  await client.query(deleteStatement, [accountValues[2]], callback);

  const selectBalanceStatement = "SELECT id, balance FROM accounts;";
  await client.query(selectBalanceStatement, callback);
} */
