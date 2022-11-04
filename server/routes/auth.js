const router = require("express").Router();
require("dotenv").config();
const auth = require("../controllers/auth");

router.get("/", auth);

module.exports = router;
