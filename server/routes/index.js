const router = require("express").Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const recipeRouter = require("./recipe");
const classRouter = require("./class");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/recipe", recipeRouter);
router.use("/class", classRouter);

module.exports = router;
