#! /usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(user_id)
);

ALTER TABLE users ADD CONSTRAINT unique_user UNIQUE (first_name, last_name);
`;

async function main() {
  try {
    console.log("seeding...");

    const client = new Client({
      connectionString:
        process.env.CONNECTION_STRING || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("done");
    process.exit(0); // Tells Render the script has successfully finished
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Exit with an error if database seeding fails
  }
}

main();
