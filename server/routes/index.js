const router = require("express").Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const recipeRouter = require("./recipe");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/recipe", recipeRouter);

module.exports = router;
