const router = require("express").Router();
require("dotenv").config();

// 레시피 등록
router.post("/", (req, res) => {
  let { type } = req.query;
  console.log("레시피 등록 결과: ", req.body);
  res.status(200).json({ message: "success" });
});

module.exports = router;
