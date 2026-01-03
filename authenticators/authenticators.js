const pool = require("../db/pool");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: "Incorrect email" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

function serializeSession(user, done) {
  done(null, user.user_id);
}

async function deserializeSession(id, done) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
}

module.exports = { localStrategy, serializeSession, deserializeSession };
