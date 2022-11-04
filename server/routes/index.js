const router = require("express").Router();
const loginRouter = require("./login");
const authRouter = require("./auth");

router.use("/login", loginRouter);
router.use("/auth", authRouter);

module.exports = router;
