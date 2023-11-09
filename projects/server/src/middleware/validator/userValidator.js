const { check, body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

module.exports = {
  registerByForm: validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("Username can't contain spaces"),
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be valid email"),
    body("phone", "phone cannot be empty")
      .notEmpty()
      .withMessage("phone is required")
      .isMobilePhone()
      .withMessage("must be valid phone number"),
    body("image_profile").optional(),
    body("password", "password cannot be empty")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("confirm_password")
      .notEmpty()
      .withMessage("You must type a confirmation password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("The passwords do not match"),
  ]),

  registrationByGmail: validate([
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be valid email"),
    body("phone").optional(),
    body("img_profile").optional(),
  ]),

  login: validate([
    body("user_identification")
      .notEmpty()
      .withMessage("Username or email is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("password", "password cannot be empty")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
  ]),

  updateProfile: validate([
    body("username")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("Username can't contain spaces"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("must be valid phone number"),
    body("is_active")
      .optional()
      .isMobilePhone()
      .withMessage("must be valid phone number"),
    body("password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("new_password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("new_confirm_password")
      .optional()
      .custom((value, { req }) => value === req.body.new_password)
      .withMessage("The passwords do not match"),
  ]),
};
