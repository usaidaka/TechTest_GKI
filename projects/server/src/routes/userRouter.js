const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/user-test", userController.userTest);

module.exports = router;
