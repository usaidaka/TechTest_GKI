const router = require("express").Router();
const userController = require("../controllers/userController");
const Verify = require("../middleware/webToken");
const handleImageProfileUpload = require("../middleware/multer/imageProfile");
const userValidator = require("../middleware/validator/userValidator");

/* GET METHOD */
router.get(
  "/profile",
  Verify.verifyAccessTokenAllRole,
  userController.userInformation
);
router.get("/product", userController.getAllProduct);
router.get("/product/:productID", userController.getProductDetail);
router.get(
  "/product-per-category/:categoryID",
  userController.getProductPerCategory
);
router.get("/product-search/:productName", userController.getProductByName);

/* POST METHOD */
router.post("/login", userValidator.login, userController.login);
router.post(
  "/register-by-gmail",
  userValidator.registrationByGmail,
  userController.registerAndLoginByGmail
);
router.post(
  "/register",
  userValidator.registerByForm,
  userController.registerByForm
);

/* PATCH METHOD */
router.patch(
  "/profile",
  Verify.verifyAccessTokenUser,
  handleImageProfileUpload,
  userController.editProfile
);

module.exports = router;
