const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query(`
        SELECT first_name, last_name, title, body, timestamp
        FROM messages
        JOIN users ON messages.user_id = users.user_id
        `);
  return rows;
}

async function createUser(firstName, LastName, email, password) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`,
    [firstName, LastName, email, password]
  );
}

module.exports = { getAllMessages, createUser };
