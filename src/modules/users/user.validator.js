const { body, param, check } = expressValidator;
let signUpPayloadValidation = [
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
];
let completeProfilePayloadValidation = [
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
  body("telephoneNumber")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isNumeric()
    .withMessage(messages.invalidDataType("Number")),
  body("countryCode")
    .notEmpty()
    .withMessage(messages.notEmpty)
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
let updatePayloadValidation = [
  body("firstName")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("lastName")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("email")
    .matches(dataConstraint.EMAIL_REGEX)
    .withMessage(messages.invalidFormat("Email"))
    .isString()
    .withMessage(messages.invalidDataType("String"))
    .optional(),
  body("telephoneNumber")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isNumeric()
    .withMessage(messages.invalidDataType("Number"))
    .optional(),
  body("countryCode")
    .notEmpty()
    .withMessage(messages.notEmpty)
    .isNumeric()
    .withMessage(messages.invalidDataType("Number"))
    .optional(),
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
  body("password")
    .isLength({ min: dataConstraint.PASSWORD_MIN_LENGTH })
    .withMessage(messages.invalidLength)
    .isString()
    .withMessage(messages.invalidDataType("String"))
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
  body("userName")
    .exists()
    .withMessage(messages.notPresent)
    .notEmpty()
    .withMessage(messages.notEmpty),
  body("countryCode")
    .isNumeric()
    .withMessage(messages.invalidDataType("Number"))
    .optional(),
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
let getProfile = [param("id").optional()];

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
  updatePayloadValidation,
  completeProfilePayloadValidation,
  getProfile,
};
