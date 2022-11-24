const router = require("express").Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const recipeRouter = require("./recipe");
const classRouter = require("./class");
const likeRouter = require("./like");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/recipe", recipeRouter);
router.use("/class", classRouter);
router.use("/like", likeRouter);

module.exports = router;
