require("dotenv").config();

const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");
const validateUserDetails = require("../inputValidator/inputValidatorCreateUser");
const validatePostDetails = require("../inputValidator/inputValidatorCreatePost");

async function getMessages(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { messages, user: req.user });
}

function signUpGet(req, res) {
  res.render("sign-up-form");
}

const signUpPost = [
  validateUserDetails,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("sign-up-form", { errors: errors.array(), formData: req.body });
    }
    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      isAdmin,
    } = matchedData(req);
    try {
      await db.createUser(firstName, lastName, username, password, isAdmin);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
];

function logIn(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next);
}

function logOut(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
}

async function logInMember(req, res) {
  const { passcode } = req.body;
  const { id } = req.params;
  if (passcode === process.env.secret) {
    await db.updateMembership(id);
  }
  res.redirect("/");
}

function createPostGet(req, res) {
  const { id } = req.params;
  res.render("create-post", { user: req.user, id: id });
}

const createPostPost = [
  validatePostDetails,
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("create-post", { errors: errors.array(), formData: req.body, id });
    }
    const { title, body } = matchedData(req);
    await db.createPost(id, title, body);
    res.redirect("/");
  },
];

async function deleteMessage(req, res) {
  const { id } = req.params;
  await db.deleteMessage(id);
  res.redirect("/");
}

async function deleteAllMessages(req, res) {
  await db.deleteAllMessages();
  res.redirect("/");
}

module.exports = {
  getMessages,
  signUpGet,
  signUpPost,
  logIn,
  logOut,
  logInMember,
  createPostGet,
  createPostPost,
  deleteMessage,
  deleteAllMessages,
};
