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

module.exports = router;
