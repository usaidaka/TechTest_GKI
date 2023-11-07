const router = require("express").Router();
const adminController = require("../controllers/adminController");

router.get("/admin-test", adminController.adminTest);

module.exports = router;
