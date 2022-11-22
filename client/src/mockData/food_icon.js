import banchan from "../assets/food_icons/banchan.png";
import daily from "../assets/food_icons/daily.png";
import dessert from "../assets/food_icons/dessert.png";
import diet from "../assets/food_icons/diet.png";
import drink from "../assets/food_icons/drink.png";
import fast from "../assets/food_icons/fast.png";
import fusion from "../assets/food_icons/fusion.png";
import jam from "../assets/food_icons/jam.png";
import meat from "../assets/food_icons/meat.png";
import milk from "../assets/food_icons/milk.png";
import mushroom from "../assets/food_icons/mushroom.png";
import noodles from "../assets/food_icons/noodles.png";
import pasta from "../assets/food_icons/pasta.png";
import rice from "../assets/food_icons/rice.png";
import salad from "../assets/food_icons/salad.png";
import seafood from "../assets/food_icons/seafood.png";
import soup from "../assets/food_icons/soup.png";
import tteok from "../assets/food_icons/tteok.png";
import vegetable from "../assets/food_icons/vegetable.png";
import wheat from "../assets/food_icons/wheat.png";
import soju from "../assets/food_icons/soju.png";
import dumpling from "../assets/food_icons/dumpling.png";
import sushi from "../assets/food_icons/sushi.png";
import theRest from "../assets/food_icons/theRest.png";
import all from "../assets/food_icons/all.png";

export const foodImgs = [
  { sort: "type", name: "반찬", src: banchan },
  { sort: "type", name: "국물류", src: soup },
  { sort: "type", name: "디저트", src: dessert },
  { sort: "type", name: "면류", src: noodles },
  { sort: "type", name: "밥류", src: rice },
  { sort: "type", name: "분식류", src: tteok },
  { sort: "type", name: "퓨전", src: fusion },
  { sort: "type", name: "양념/잼", src: jam },
  { sort: "type", name: "양식", src: pasta },
  { sort: "type", name: "샐러드", src: salad },
  { sort: "type", name: "음료", src: drink },
  { sort: "circumstance", name: "일상", src: daily },
  { sort: "circumstance", name: "간편식", src: fast },
  { sort: "circumstance", name: "술안주", src: soju },
  { sort: "circumstance", name: "다이어트", src: diet },
  { sort: "ingredient", name: "육류", src: meat },
  { sort: "ingredient", name: "채소류", src: vegetable },
  { sort: "ingredient", name: "해물류", src: seafood },
  { sort: "ingredient", name: "달걀/유제품", src: milk },
  { sort: "ingredient", name: "버섯류", src: mushroom },
  { sort: "ingredient", name: "곡류", src: wheat },
];

export const classMenuIcons = [
  { name: "전체", src: all },
  { name: "한식", src: daily },
  { name: "중식", src: dumpling },
  { name: "일식", src: sushi },
  { name: "양식", src: pasta },
  { name: "베이킹", src: dessert },
  { name: "기타", src: theRest },
];
