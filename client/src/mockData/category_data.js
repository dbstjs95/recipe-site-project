export const typeData = [
  "전체",
  "반찬",
  "국물류",
  "면류",
  "밥류",
  "분식류",
  "디저트",
  "퓨전",
  "양념/잼",
  "양식",
  "샐러드",
  "음료",
  "기타",
];

export const circumstanceData = [
  "전체",
  "일상",
  "간편식",
  "술안주",
  "다이어트",
  "야식",
  "영양식",
  "기타",
];
export const ingredientData = [
  "전체",
  "육류",
  "채소류",
  "해물류",
  "달걀/유제품",
  "버섯류",
  "과일류",
  "곡류",
  "기타",
];

export const dataForRegisterPage = {
  type: ["종류별", ...typeData.slice(1)],
  circumstance: ["상황별", ...circumstanceData.slice(1)],
  ingredient: ["재료별", ...ingredientData.slice(1)],
  servings: ["인원", "1인분", "2인분", "3인분", "4인분", "5인분", "6인분 이상"],
  time: [
    "시간",
    "5분이내",
    "10분이내",
    "15분이내",
    "20분이내",
    "30분이내",
    "60분이내",
    "90분이내",
    "2시간이내",
    "2시간이상",
  ],
  level: ["난이도", "아무나", "초급", "중급", "고급"],
};

export const dataKeys1 = ["type", "circumstance", "ingredient"];
export const dataKeys2 = ["servings", "time", "level"];
