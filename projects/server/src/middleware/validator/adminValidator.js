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
  addUser: validate([
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

  editUser: validate([
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
    body("is_active").optional(),
  ]),

  createProduct: validate([
    body("name")
      .notEmpty()
      .withMessage("product name is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("product must be between 3 to 20 characters long."),
    body("price", "price cannot be empty")
      .notEmpty()
      .isNumeric("input a valid price")
      .withMessage("price is required"),
    body("category_id", "category cannot be empty")
      .notEmpty()
      .withMessage("phone is required"),
    body("description", "description cannot be empty").notEmpty(),
    body("is_active")
      .isBoolean()
      .notEmpty()
      .withMessage("You must to defined the product status"),
  ]),

  editProduct: validate([
    body("name")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("product name must be between 3 to 20 characters long."),
    body("price", "price cannot be empty")
      .notEmpty()
      .isNumeric("input a valid price")
      .withMessage("price is required"),
    body("category_id", "category cannot be empty")
      .notEmpty()
      .withMessage("phone is required"),
    body("description", "description cannot be empty").notEmpty(),
    body("is_active")
      .notEmpty()
      .withMessage("You must to defined the product status"),
  ]),

  createCategory: validate([
    body("name")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("category name must be between 3 to 20 characters long."),
  ]),
  editCategory: validate([
    body("name")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("category name must be between 3 to 20 characters long."),
  ]),
};
