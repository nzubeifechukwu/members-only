const bcrypt = require("bcryptjs");

const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query(`
        SELECT first_name, last_name, title, body, timestamp, message_id
        FROM messages
        JOIN users ON messages.user_id = users.user_id
        `);
  return rows;
}

async function createUser(firstName, LastName, email, password, isAdmin) {
  const hashedPassword = await bcrypt.hash(password, 10);
  isAdmin == "yes" ? true : false;
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ($1, $2, $3, $4, $5)`,
    [firstName, LastName, email, hashedPassword, isAdmin]
  );
}

async function createPost(id, title, body) {
  await pool.query(
    `INSERT INTO messages (title, body, user_id) VALUES ($1, $2, $3)`,
    [title, body, id]
  );
}

async function updateMembership(id) {
  await pool.query(`UPDATE users SET is_member = TRUE where user_id = $1`, [
    id,
  ]);
}

async function deleteMessage(id) {
  try {
    await pool.query(`DELETE FROM messages WHERE message_id = $1`, [id]);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

async function deleteAllMessages() {
  try {
    await pool.query("DELETE FROM messages");
  } catch (error) {
    console.error("Error deleting all messages:", error);
    throw error;
  }
}

module.exports = {
  getAllMessages,
  createUser,
  createPost,
  updateMembership,
  deleteMessage,
  deleteAllMessages,
};
