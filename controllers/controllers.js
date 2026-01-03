const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");
const e = require("express");

async function getAllMessagesWithoutAuthorDetails(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages, user: req.user });
}

async function getAllMessagesWithAuthorDetails(req, res) {}

function addNewUserGet(req, res) {
  res.render("sign-up-form");
}

async function addNewUserPost(req, res, next) {
  const { firstName, lastName, username, password, confirmPassword } = req.body;
  try {
    if (password === confirmPassword) {
      await db.createUser(firstName, lastName, username, password);
    } else {
      console.log("Passwords don't match.");
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

// function logInGet(req, res) {
//   res.render("log-in-form");
// }

function logIn(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next);
}

function logOut(req, res, next) {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect("/");
  });
}

module.exports = {
  getAllMessagesWithoutAuthorDetails,
  getAllMessagesWithAuthorDetails,
  addNewUserGet,
  addNewUserPost,
  // logInGet,
  logIn,
  logOut,
};
