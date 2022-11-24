const router = require("express").Router();
require("dotenv").config();
const classDB = require("../db/class");

// 클래스 리스트
router.get("/", async (req, res) => {
  let { category = "전체", offset = 0, limit = 12 } = req.query;

  let result = await classDB.getClassList(
    category,
    Number(offset),
    Number(limit)
  );

  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result });
  }

  result.status = 200;
  return res.status(200).json(result);
});

// 클래스 상세
router.get("/:classId", async (req, res) => {
  let { classId } = req.params;

  let result = await classDB.getClass(classId);

  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result });
  }
  result.status = 200;
  return res.status(200).json(result);
});

// 클래스 댓글 불러오기
router.get("/:classId/comment", async (req, res) => {
  let { classId } = req.params;
  const { targetId, limit } = req.query;

  if (!classId || !limit)
    return res.status(400).json({ message: "Can't find classId or limit" });

  try {
    let comments = await classDB.getClassComments(
      classId,
      targetId ? Number(targetId) : "",
      Number(limit)
    );

    if (!comments) return res.status(500).json({ message: "server error" });

    if (typeof comments === "string" && comments.startsWith("error")) {
      return res.status(400).json({ message: "fail", comments });
    }

    return res.status(200).json({ message: "success", comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

// 댓글 삭제
router.delete("/:classId/comment/:cmtId", async (req, res) => {
  const { cmtId } = req.params;

  let result = await classDB.deleteComment(cmtId);
  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error"))
    return res.status(400).json({ message: "fail", result });

  return res.status(200).json({ message: "success" });
});

// 댓글 추가
router.post("/:classId/comment", async (req, res) => {
  // 테스트
  let userId = 1;

  const { classId } = req.params;
  const { content } = req.body;

  if (!classId || !content)
    return res.status(400).json({ message: "can't find classId or content" });

  let newComment = { user_id: userId, class_id: classId, content };

  let result = await recipeDB.addComment(newComment);
  if (!result) return res.status(500).json({ message: "server error" });

  if (typeof result === "string" && result.startsWith("error"))
    return res.status(400).json({ message: "fail", result });

  return res.status(201).json({ message: "success" });
});

module.exports = router;
