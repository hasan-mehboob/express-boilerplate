const { body } = expressValidator;
let newsLetterValidation = [
  body("email")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .isEmail()
    .withMessage(messages.invalidDataType("Email")),
];

module.exports = {
  newsLetterValidation,
};
