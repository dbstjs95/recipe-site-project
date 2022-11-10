const router = require("express").Router();
const loginRouter = require("./login");
const authRouter = require("./auth");
const recipeRouter = require("./recipe");

router.use("/user", loginRouter);
router.use("/auth", authRouter);
router.use("/recipe", recipeRouter);

module.exports = router;
