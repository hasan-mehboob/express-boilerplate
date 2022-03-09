const { body, param, check } = expressValidator;
let signUpPayloadValidation = [
  body("firstName")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String")),
  body("lastName")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String")),
  body("email")
    .exists()
    .withMessage(messages.notPresent)
    .matches(dataConstraint.EMAIL_REGEX)
    .withMessage(messages.invalidFormat("Email"))
    .isString()
    .withMessage(messages.invalidDataType("String")),
  body("password")
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength)
    .isString()
    .withMessage(messages.invalidDataType("String")),
  // FIXME: add phone number min length validation
  body("telephoneNumber")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength)
    .isNumeric()
    .withMessage(messages.invalidDataType("Number")),
  body("dob").isDate().withMessage(messages.invalidDataType("Date")).optional(),
  body("noOfChildern")
    .isNumeric()
    .withMessage(messages.invalidDataType("Number"))
    .optional(),
  body("zipCode")
    .isNumeric()
    .withMessage(messages.invalidDataType("Number"))
    .optional(),
  body("street")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("city")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("state")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("country")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  check("gender")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .isIn(["male", "female"])
    .optional(),
  check("maritalStatus")
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .isIn(["single", "married", "divorced"])
    .optional(),
];

let signInPayloadValidation = [
  body("email")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String")),
  body("password")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength)
    .isString()
    .withMessage(messages.invalidDataType("String")),
];
let forgotPasswordPayloadValidation = [
  body("user")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty),
  // .if(body("user").isEmail().withMessage(messages.invalidEmail)),

  // body("isEmail")
  //   .exists()
  //   .withMessage(messages.notPresent)
  //   .notEmpty()
  //   .withMessage(messages.notEmpty)
  //   .isBoolean()
  //   .withMessage(messages.invalidDataType("Boolean")),
];

let resetPasswordPayload = [
  param("id").exists(),
  body("code")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isNumeric()
    .withMessage(messages.invalidDataType("Integer")),
  body("password")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength)
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength),
  body("userName")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty),
];
let verifyCodePayloadValidation = [
  param("id").exists(),
  body("code")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isNumeric()
    .withMessage(messages.invalidDataType("Integer")),
  body("userName")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty),
];

let resendCodePayloadValidation = [
  param("id").exists(),
  body("userName")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty),
];

module.exports = {
  signUpPayloadValidation,
  signInPayloadValidation,
  forgotPasswordPayloadValidation,
  resetPasswordPayload,
  verifyCodePayloadValidation,
  resendCodePayloadValidation,
};
