const { body } = expressValidator;
let userSecurityQuestionValidator = [
  body("answer")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String")),
  body("questionId")
    .exists()
    .withMessage(messages.notPresent)
    .isNumeric()
    .withMessage(messages.invalidDataType("Integer")),
];

module.exports = {
  userSecurityQuestionValidator,
};
