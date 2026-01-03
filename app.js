require("dotenv").config();

const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");

const router = require("./routes/router");
const {
  localStrategy,
  serializeSession,
  deserializeSession,
} = require("./authenticators/authenticators");

const app = express();
const PORT = 10000; // Render uses port 10000
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set(express.static(assetsPath));

app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

passport.use(localStrategy);
passport.serializeUser(serializeSession);
passport.deserializeUser(deserializeSession);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Express app listening on port ${PORT}`);
});
