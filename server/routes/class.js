// const router = require("express").Router();
// require("dotenv").config();
// const classDB = require("../db/class");
// const { auth, userAuth } = require("../middleware/auth");

// // 클래스 리스트
// router.get("/", auth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   let { category = "전체", offset = 0, limit = 12 } = req.query;

//   let result = await classDB.getClassList(
//     category,
//     Number(offset),
//     Number(limit)
//   );

//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error")) {
//     return res.status(400).json({ message: "fail", result, authInfo });
//   }

//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// // 클래스 상세
// router.get("/:classId", auth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   let { classId } = req.params;

//   let result = await classDB.getClass(classId, userId);

//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error")) {
//     return res.status(400).json({ message: "fail", result, authInfo });
//   }

//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// // 클래스 댓글 불러오기
// router.get("/:classId/comment", async (req, res) => {
//   let { classId } = req.params;
//   const { targetId, limit } = req.query;

//   if (!classId || !limit)
//     return res.status(400).json({ message: "Can't find classId or limit" });

//   let comments = await classDB.getClassComments(
//     classId,
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
// router.delete("/:classId/comment/:cmtId", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;

//   const { cmtId } = req.params;

//   let result = await classDB.deleteComment(cmtId);
//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result, authInfo });

//   return res.status(200).json({ message: "success", status: 200, authInfo });
// });

// // 댓글 추가
// router.post("/:classId/comment", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let userId = req?.user?.id;

//   const { classId } = req.params;
//   const { content } = req.body;

//   if (!classId || !content)
//     return res
//       .status(400)
//       .json({ message: "can't find classId or content", authInfo });

//   let newComment = { user_id: userId, class_id: classId, content };

//   let result = await classDB.addComment(newComment);
//   if (!result)
//     return res.status(500).json({ message: "server error", authInfo });

//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result, authInfo });

//   return res.status(201).json({ message: "success", status: 200, authInfo });
// });

// // 클래스 추가
// router.post("/", async (req, res) => {
//   // let data = {
//   //   "hostData": {
//   //     "name": "김인숙",
//   //     "email": "class01@email.com",
//   //     "desc": "안녕하세요. 중화요리연구가 김인숙 입니다.",
//   //     "details": ""
//   //   },
//   //   "classData": {
//   //     "category": "중식",
//   //     "header_title": "중화요리 만들기 중급반",
//   //     "header_desc": "다양한 중화요리를 만들어보아요!",
//   //     "time_required": 120,
//   //     "date_time": "2022-12-05 11:00:00",
//   //     "limit": 26,
//   //     "price": 22000,
//   //     "place": "경기도 수원시 팔달구 사랑의 집 2층 1호",
//   //     "intro": "매번 사먹기만 한 중화요리를 직접 만들어 먹는 시간을 가져보아요~",
//   //     "deadline": "2022-12-01 22:59:59"
//   //   },
//   //   "foodData": [
//   //     {
//   //       "name": "짜장면",
//   //       "img": ""
//   //     },
//   //     {
//   //       "name": "탕수육",
//   //       "img": ""
//   //     }
//   //   ]
//   // };

//   const data = req.body;

//   if (!data) return res.status(400).json({ message: "can't find data" });

//   let result = await classDB.createClass(data);

//   if (!result) return res.status(500).json({ message: "server error" });

//   if (typeof result === "string" && result.startsWith("error"))
//     return res.status(400).json({ message: "fail", result });

//   result.status = 200;
//   return res.status(201).json(result);
// });

// // 클래스 가격 확인
// router.get("/:classId/check", userAuth, async (req, res) => {
//   let authInfo = req?.authInfo;
//   let { classId } = req.params;
//   let { amount } = req.query;

//   if (!classId || !amount)
//     return res
//       .status(400)
//       .json({ message: "can't find classId or amount", authInfo });

//   let result = await classDB.checkClassPrice(classId, amount);

//   if (result === null)
//     return res.status(500).json({ message: "server error", authInfo });

//   result.status = 200;
//   result.authInfo = authInfo;
//   return res.status(200).json(result);
// });

// module.exports = router;
