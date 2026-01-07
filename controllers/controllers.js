require("dotenv").config();

const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");

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
    res.redirect(`/member/${req.user.user_id}`);
  } else {
    res.redirect("/");
  }
}

function createPostGet(req, res) {
  const { id } = req.params;
  res.render("create-post", { user: req.user, id: id });
}

async function createPostPost(req, res) {
  const { id } = req.params;
  const { title, body } = req.body;
  await db.createPost(id, title, body);
  res.redirect(`/member/${id}`);
}

module.exports = {
  getMessagesWithoutAuthorDetails,
  getMessagesWithAuthorDetails,
  signUpGet,
  signUpPost,
  logIn,
  logOut,
  logInMember,
  createPostGet,
  createPostPost,
};
