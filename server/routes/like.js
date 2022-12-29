// const router = require("express").Router();
// require("dotenv").config();
// const likeDB = require("../db/like");
// const { userAuth } = require("../middleware/auth");

// // 레시피 좋아요 기능
// router.post("/:recipeId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   let { recipeId } = req.params;

//   let result = await likeDB.addLike(userId, recipeId);

//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error")) {
//     return res.status(400).json({ message: "fail", result, authInfo });
//   }

//   // 결과값은 좋아요 수
//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// // 레시피 좋아요 취소
// router.delete("/:recipeId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;
//   let { recipeId } = req.params;
//   let result = await likeDB.deleteLike(userId, recipeId);
//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });
//   if (typeof result === "string" && result.startsWith("error")) {
//     return res.status(400).json({ message: "fail", result, authInfo });
//   }
//   // 결과값은 좋아요 수
//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// module.exports = router;
