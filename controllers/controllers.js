require("dotenv").config();

const { validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const db = require("../db/queries");
const validateUserDetails = require("../inputValidator/inputValidatorCreateUser");

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

// async function signUpPost(req, res, next) {
//   const { firstName, lastName, username, password, confirmPassword, isAdmin } =
//     req.body;
//   try {
//     if (password === confirmPassword) {
//       await db.createUser(firstName, lastName, username, password, isAdmin);
//       res.redirect("/");
//     } else {
//       console.log("Passwords don't match.");
//     }
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// }

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

async function createPostPost(req, res) {
  const { id } = req.params;
  const { title, body } = req.body;
  await db.createPost(id, title, body);
  res.redirect("/");
}

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
