const pool = require("../db/pool");
const LocalStrategy = require("passport-local").Strategy;

const localStrategy = new LocalStrategy(async (email, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: "Incorrect email" });
    }
    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

function serializeSession(user, done) {
  done(null, user.id);
}

async function deserializeSession(id, done) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
}

module.exports = { localStrategy, serializeSession, deserializeSession };
