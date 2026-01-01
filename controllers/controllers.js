const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");

async function getAllMessagesWithoutAuthorDetails(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages });
}

async function getAllMessagesWithAuthorDetails(req, res) {}

function addNewUserGet(req, res) {
  res.render("sign-up-form");
}

async function addNewUserPost(req, res, next) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    if (password === confirmPassword) {
      await db.createUser(firstName, lastName, email, password);
    } else {
      console.log("Passwords don't match.");
    }
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

function logInGet(req, res) {
  res.render("log-in-form");
}

function logInPost() {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  });
}

module.exports = {
  getAllMessagesWithoutAuthorDetails,
  getAllMessagesWithAuthorDetails,
  addNewUserGet,
  addNewUserPost,
  logInGet,
  logInPost,
};
