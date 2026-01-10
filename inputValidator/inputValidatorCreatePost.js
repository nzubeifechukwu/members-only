const { body } = require("express-validator");

const titleLengthError = "must be between 1 and 50 characters";
const bodyLengthError = "must be between 1 and 200 characters";

const validatePostDetails = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Post title ${titleLengthError}`),
  body("body")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage(`Post body ${bodyLengthError}`),
];

module.exports = validatePostDetails;
