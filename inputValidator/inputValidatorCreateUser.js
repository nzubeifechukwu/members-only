const { body } = require("express-validator");

const alphaError = "must contain only letters.";
const lengthError = "must be between 1 and 20 characters";

const validateUserDetails = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaError}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthError}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaError}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthError}`),
  body("username").trim().isEmail().withMessage("Not a valid email address"),
  body("password").trim().notEmpty(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  body("isAdmin").notEmpty(),
];

module.exports = validateUserDetails;
