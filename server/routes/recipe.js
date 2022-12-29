// const router = require("express").Router();
// require("dotenv").config();
// const recipeDB = require("../db/recipe");
// const { auth, userAuth } = require("../middleware/auth");

// let example = {
//   user_id: 2,
//   public: 1,
//   title: "사라다빵 만들기",
//   mainSrc: "upload/recipe/06056db288ae4f4fb90d8a3c1a642f8f.jpeg",
//   intro:
//     " Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique doloremque aspernatur voluptate modi iusto neque accusamus recusandae assumenda quia! Aliquam dolore tenetur odit accusantium natus provident rem quas quos voluptatem!",
//   category: ["분식류", "간편식", "곡류"],
//   details: ["2인분", "20분이내", "아무나"],
//   ingredients: [
//     {
//       name: "양념장",
//       contents: [
//         ["고추장", "4T"],
//         ["설탕", "2T"],
//         ["간장", "2T"],
//         ["다진마늘", "0.5T"],
//         ["라면스프", "2T"],
//       ],
//     },
//     {
//       name: "부가재료",
//       contents: [
//         ["떡", "300g"],
//         ["대파", "1개"],
//         ["삶은 계란", "1~2개"],
//         ["쫄면", "100g"],
//       ],
//     },
//   ],
//   steps: [
//     [
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus minima enim quidem quasi vel obcaecati sequi, facere ducimus delectus nulla?",
//       "upload/recipe/2c825ad948144197b1a3e4e48183e8c9.png",
//     ],
//     [
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium, iusto at? Ipsum ab animi placeat iste accusantium eligendi, temporibus odio asperiores reprehenderit! Eum eos voluptatum, amet velit vero fuga alias?",
//       "upload/recipe/4b4f62c32c8741dd8098ea4ada2c6a89.jpeg",
//     ],
//     [
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia delectus harum qui velit enim numquam aspernatur! Architecto odio explicabo nostrum quasi maxime reiciendis in impedit eveniet voluptatem ipsa, ex provident harum, mollitia vel expedita omnis repudiandae enim neque. Ad accusantium aperiam sapiente cum placeat neque voluptatum omnis veritatis. Nostrum, tenetur.",
//       "upload/recipe/65d8828b875e44928bf82505c094ee99.jpeg",
//     ],
//     [
//       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia delectus harum qui velit enim numquam aspernatur!",
//       "upload/recipe/917969c882094837b6899a0b7ca81fe6.jpeg",
//     ],
//   ],
// };

// // 레시피 등록
// router.post("/", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   const data = req.body;

//   let isRegistered = await recipeDB.createRecipe(userId, data);

//   if (!isRegistered)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (isRegistered === "success") {
//     return res.status(201).json({ message: "success", status: 200, authInfo });
//   } else if (
//     typeof isRegistered === "string" &&
//     isRegistered.startsWith("error")
//   ) {
//     return res.status(400).json({ message: "fail", authInfo });
//   }
// });

// // 레시피 수정: 입력된 값 불러오기
// router.get("/:recipeId/modify", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const { recipeId } = req.params;

//   let myRecipe = await recipeDB.getMyRecipe(recipeId);

//   if (!myRecipe)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof myRecipe === "string" && myRecipe.startsWith("error")) {
//     return res.status(400).json({ message: "fail", myRecipe, authInfo });
//   }

//   myRecipe.status = 200;
//   myRecipe.authInfo = authInfo;
//   return res.status(200).json(myRecipe);
// });

// // 레시피 수정 기능
// router.put("/:recipeId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const { recipeId } = req.params;
//   const data = req.body;

//   let result = await recipeDB.updateRecipe(recipeId, data);

//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error")) {
//     return res.status(400).json({ message: "fail", result, authInfo });
//   }

//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// // 레시피 삭제
// router.delete("/:recipeId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const { recipeId } = req.params;

//   const isDeleted = await recipeDB.deleteRecipe(recipeId);

//   if (isDeleted === 1) {
//     return res.status(200).json({ message: "success", status: 200, authInfo });
//   } else if (isDeleted === 0) {
//     return res.status(400).json({ message: "can't find data", authInfo });
//   }

//   if (isDeleted === "DB error")
//     return res.status(500).json({ message: "server error", authInfo });

//   return res.status(400).json({ message: "fail", authInfo });
// });

// // 레시피 리스트
// router.get("/", auth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const {
//     list_type = "",
//     order_by = "like",
//     category = "",
//     keyword = "",
//     offset = 0,
//     limit = 15,
//   } = req.query;

//   let result = await recipeDB.getRecipeList(
//     list_type,
//     order_by,
//     category,
//     keyword,
//     Number(offset),
//     Number(limit)
//   );

//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });
//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result, authInfo });

//   result.status = 200;
//   result.authInfo = authInfo;

//   return res.status(200).json(result);
// });

// // 레시피 상세
// router.get("/:recipeId", auth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   let { recipeId } = req.params;
//   let recipe = await recipeDB.getRecipe(recipeId, userId);

//   if (!recipe)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof recipe === "string" && recipe.startsWith("error")) {
//     return res.status(400).json({ message: "fail", recipe, authInfo });
//   }

//   return res
//     .status(200)
//     .json({ message: "success", status: 200, recipe, authInfo });
// });

// // 레시피 댓글 불러오기
// router.get("/:recipeId/comment", async (req, res) => {
//   const { recipeId } = req.params;
//   const { targetId, limit } = req.query;

//   if (!recipeId || !limit)
//     return res.status(400).json({ message: "Can't find recipeId or limit" });

//   let comments = await recipeDB.getRecipeComments(
//     recipeId,
//     targetId ? Number(targetId) : "",
//     Number(limit)
//   );

//   if (!comments) return res.status(500).json({ message: "server error" });

//   if (typeof comments === "string" && comments.startsWith("error")) {
//     return res.status(400).json({ message: "fail", comments });
//   }

//   return res.status(200).json({ message: "success", status: 200, comments });
// });

// // 댓글 삭제
// router.delete("/:recipeId/comment/:cmtId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const { cmtId } = req.params;

//   let result = await recipeDB.deleteComment(cmtId);
//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result, authInfo });

//   return res.status(200).json({ message: "success", status: 200, authInfo });
// });

// // 댓글 추가
// router.post("/:recipeId/comment", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   const { recipeId } = req.params;
//   const { content } = req.body;

//   if (!recipeId || !content)
//     return res
//       .status(400)
//       .json({ message: "can't find recipeId or content", authInfo });

//   let newComment = { user_id: userId, recipe_id: recipeId, content };

//   let result = await recipeDB.addComment(newComment);
//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result, authInfo });

//   return res.status(201).json({ message: "success", status: 200, authInfo });
// });

// module.exports = router;
