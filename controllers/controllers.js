require("dotenv").config();

const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");
const e = require("express");

async function getMessagesWithoutAuthorDetails(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages, user: req.user });
}

async function getMessagesWithAuthorDetails(req, res) {
  const messages = await db.getAllMessages();
  res.render("members-only", { messages, user: req.user });
}

function signUpGet(req, res) {
  res.render("sign-up-form");
}

async function signUpPost(req, res, next) {
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

function logInMember(req, res) {
  const { passcode } = req.body;
  if (passcode === process.env.secret) {
    res.redirect("/members");
  } else {
    res.redirect("/");
  }
}

module.exports = {
  getMessagesWithoutAuthorDetails,
  getMessagesWithAuthorDetails,
  signUpGet,
  signUpPost,
  logIn,
  logOut,
  logInMember,
};
