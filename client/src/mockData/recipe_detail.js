import main from "../assets/recipe_details/main.png";
import img1 from "../assets/recipe_details/1.png";
import img2 from "../assets/recipe_details/2.png";
import img3 from "../assets/recipe_details/3.png";
import img4 from "../assets/recipe_details/4.png";
import img5 from "../assets/recipe_details/5.png";
import img6 from "../assets/recipe_details/6.png";
import user from "../assets/recipe_details/user.png";

export const recipe_info = {
  id: 1,
  mainSrc: main,
  userInfo: {
    src: user,
    nickname: "요리왕비룡",
    greetings: "안녕하세요 요리왕이 될 남자, 비룡입니다!",
  },
  title: "다른 반찬 필요 없음! 맛남의광장 백종원의 다시마쌈장",
  intro:
    "작년 이맘 때쯤 맛남의광장에서 소개한 다시마쌈장!\n더운 여름 입맛 없을 때 다시마쌈장을 탁!\n밥에 쓱싹~ 비벼 먹으면 한 그릇 뚝딱 가능♥\n다른 반찬이 필요 없어요~",
  details: ["4인분", "30분 이내", "아무나"],
  view: 30356,
  like: 14433,
  commentsNum: 21,
  ingredients: [
    [
      "양념장1",
      ["가지", "1개"],
      ["설탕", "1.5Ts"],
      ["다진마늘", "1/2Ts"],
      ["간장", "2Ts"],
      ["식초", "1Ts"],
      ["버터", "2Ts"],
    ],
    [
      "양념장2",
      ["가지", "1개"],
      ["설탕", "1.5Ts"],
      ["다진마늘", "1/2Ts"],
      ["간장", "2Ts"],
      ["식초", "1Ts"],
      ["버터", "2Ts"],
    ],
    [
      "양념장3",
      ["가지", "1개"],
      ["설탕", "1.5Ts"],
      ["다진마늘", "1/2Ts"],
      ["간장", "2Ts"],
      ["식초", "1Ts"],
      ["버터", "2Ts"],
      ["다진마늘", "1/2Ts"],
      ["간장", "2Ts"],
      ["식초", "1Ts"],
      ["버터", "2Ts"],
    ],
  ],
  steps: [
    [1, "쌈 다시마는 찬물에 약 10분 이상 담가 소금기를 빼요.", img1],
    [
      2,
      "다시마, 양파, 애호박, 청양고추는 다지고 대파는 송송 썰어 준비해요.",
      img2,
    ],
    [3, "예열된 팬에 기름을 두르고 다시마와 다진 채소를 넣어 볶아요.", img3],
    [
      4,
      "재료가 볶아지면 고춧가루, 설탕, 다진 마늘, 홍고추를 넣어 볶아요.",
      img4,
    ],
    [5, "재래식 된장, 고추장을 넣어 볶아요.", img5],
    [6, "불을 끄고 참기름을 넣어 섞어 완성해요.", img6],
  ],
  resultSrc: main,
};