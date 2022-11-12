const router = require("express").Router();
require("dotenv").config();
const recipeDB = require("../db/recipe");

let example = {
  user_id: 1,
  title: "부산식 떡볶이 만들기",
  mainSrc: "upload/recipe/06056db288ae4f4fb90d8a3c1a642f8f.jpeg",
  intro:
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique doloremque aspernatur voluptate modi iusto neque accusamus recusandae assumenda quia! Aliquam dolore tenetur odit accusantium natus provident rem quas quos voluptatem!",
  category: ["분식류", "간편식", "곡류"],
  recipeInfo: ["2인분", "20분이내", "아무나"],
  ingredients: [
    {
      name: "양념장",
      contents: [
        ["고추장", "4T"],
        ["설탕", "2T"],
        ["간장", "2T"],
        ["다진마늘", "0.5T"],
        ["라면스프", "2T"],
      ],
    },
    {
      name: "부가재료",
      contents: [
        ["떡", "300g"],
        ["대파", "1개"],
        ["삶은 계란", "1~2개"],
        ["쫄면", "100g"],
      ],
    },
  ],
  steps: [
    [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus minima enim quidem quasi vel obcaecati sequi, facere ducimus delectus nulla?",
      "upload/recipe/2c825ad948144197b1a3e4e48183e8c9.png",
    ],
    [
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium, iusto at? Ipsum ab animi placeat iste accusantium eligendi, temporibus odio asperiores reprehenderit! Eum eos voluptatum, amet velit vero fuga alias?",
      "upload/recipe/4b4f62c32c8741dd8098ea4ada2c6a89.jpeg",
    ],
    [
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia delectus harum qui velit enim numquam aspernatur! Architecto odio explicabo nostrum quasi maxime reiciendis in impedit eveniet voluptatem ipsa, ex provident harum, mollitia vel expedita omnis repudiandae enim neque. Ad accusantium aperiam sapiente cum placeat neque voluptatum omnis veritatis. Nostrum, tenetur.",
      "upload/recipe/65d8828b875e44928bf82505c094ee99.jpeg",
    ],
    [
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia delectus harum qui velit enim numquam aspernatur!",
      "upload/recipe/917969c882094837b6899a0b7ca81fe6.jpeg",
    ],
  ],
};

// 레시피 등록
router.post("/", async (req, res) => {
  let { type } = req.query;
  // const data = req.body;

  let data = { ...example };
  let isRegistered = await recipeDB.CreateRecipe(type, data);

  if (isRegistered && isRegistered === "success") {
    return res.status(204).json({ message: "success" });
  }

  return res.status(400).json({ message: "fail" });
});

// 레시피 리스트
router.get("/", async (req, res) => {
  // 정렬: 최신순, 인기순, 조회순(?)
  // 검색 결과/카테고리
  // 타입별: 공개중인, 작성중인 --> 마이페이지
});

// 레시피 상세
router.get("/:recipeId", async (req, res) => {
  let { recipeId } = req.params;
  let recipe = await recipeDB.findRecipeById(recipeId);

  if (recipe) {
    return res.status(200).json({ message: "success", recipe });
  }

  return res.status(400).json({ message: "fail" });
});

module.exports = router;
