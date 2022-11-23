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

module.exports = router;
