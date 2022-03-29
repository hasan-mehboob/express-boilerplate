const { body, param } = expressValidator;

let securityQuestionPayloadValidation = [
  body("question")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String")),
];
let securityQuestionBulkPayloadValidation = [
  body("questions")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isArray()
    .withMessage(messages.invalidDataType("Array")),
];

module.exports = {
  securityQuestionPayloadValidation,
  securityQuestionBulkPayloadValidation,
};
