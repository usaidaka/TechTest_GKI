const router = require("express").Router();
const adminController = require("../controllers/adminController");
const Verify = require("../middleware/webToken");
const handleImageProductUpload = require("../middleware/multer/imageProduct");
const handleImageProfileUpload = require("../middleware/multer/imageProfile");
const handleImageCategoryUpload = require("../middleware/multer/imageCategory");
const adminValidator = require("../middleware/validator/adminValidator");

/* GET METHOD */
router.get("/user-list", adminController.getAllUser);
router.get("/product-list", adminController.getAllProductParanoid);
router.get("/category", adminController.getAllCategory);
router.get("/report-dashboard", adminController.reportDashboard);
router.get("/user/:userID", adminController.getUserByID);

/* POST METHOD */
router.post(
  "/product",
  Verify.verifyAccessTokenAdmin,
  handleImageProductUpload,
  adminValidator.createProduct,
  adminController.createProduct
);
router.post(
  "/user",
  Verify.verifyAccessTokenAdmin,
  handleImageProfileUpload,
  adminValidator.addUser,
  adminController.addUser
);
router.post(
  "/category",
  Verify.verifyAccessTokenAdmin,
  handleImageCategoryUpload,
  adminValidator.createCategory,
  adminController.createCategory
);

/* PATCH METHOD */
router.patch(
  "/user/:userID",
  Verify.verifyAccessTokenAdmin,
  handleImageProfileUpload,
  adminValidator.editUser,
  adminController.editUser
);
router.patch(
  "/approval-activation/:userID",
  Verify.verifyAccessTokenAdmin,
  adminController.approvalActivation
);
router.patch(
  "/product/:productID",
  Verify.verifyAccessTokenAdmin,
  handleImageProductUpload,
  adminValidator.editProduct,
  adminController.editProduct
);
router.patch(
  "/category/:categoryID",
  Verify.verifyAccessTokenAdmin,
  handleImageCategoryUpload,
  adminValidator.editCategory,
  adminController.editCategory
);

/* DELETE METHOD */
router.delete(
  "/product/:productID",
  Verify.verifyAccessTokenAdmin,
  adminController.deleteProduct
);
router.delete(
  "/category/:categoryID",
  Verify.verifyAccessTokenAdmin,
  adminController.deleteCategory
);
router.delete(
  "/user/:userID",
  Verify.verifyAccessTokenAdmin,
  adminController.deleteUser
);

module.exports = router;
