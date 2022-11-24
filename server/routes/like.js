const router = require("express").Router();
require("dotenv").config();
const likeDB = require("../db/like");

// 레시피 좋아요 기능
router.post("/:recipeId", async (req, res) => {
  // 테스트
  let userId = 1;

  let { recipeId } = req.params;

  let result = await likeDB.addLike(userId, recipeId);

  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result });
  }

  result.status = 200;
  return res.status(200).json(result);
});

// 레시피 좋아요 취소
router.delete("/:recipeId", async (req, res) => {
  // 테스트
  let userId = 1;

  let { recipeId } = req.params;

  let result = await likeDB.deleteLike(userId, recipeId);

  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result });
  }

  result.status = 200;
  return res.status(200).json(result);
});

module.exports = router;
