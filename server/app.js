const express = require("express");
const { sequelize, User } = require("./models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// api: https://docs.google.com/spreadsheets/d/1PdOtnxet5QdoUqcemtTGM1Ek04Q5mQK-WpDonJqDNLA/edit#gid=0
const PORT = process.env.PORT || 5000;

const app = express();

// sequelize
//   .sync()
//   .then(() => {
//     console.log("데이터베이스 연결 성공");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// https://kirkim.github.io/javascript/2021/10/16/body_parser.html
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 만일 credentail: true로 인증된 요청을 사용할 경우, Access-Control-Allow-Origin 값이 '*' 일 경우 에러가 발생.
app.use(
  cors({
    preflightContinue: true,
    // 출처 허용 옵션
    origin: [
      process.env.OUR_CLIENT_URI,
      "https://nid.naver.com",
      "https://openapi.naver.com",
      "http://my-recipe-front.s3-website.ap-northeast-2.amazonaws.com",
      "https://api.iamport.kr",
    ],
    methods: "GET,PUT,POST,OPTIONS,DELETE",
    // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근(credentials 스펠링 주의!!!!)
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/v1", require("./routes"));
// app.get("/test", async (req, res) => {
//   // https에서만 가능(SameSite=None;Secure)
//   // res.setHeader("Set-Cookie", "test=1234;HttpOnly;SameSite=None;Secure");
//   let user_id = 1;
//   let result = await User.findByPk(user_id);
//   res.status(200).json({ message: "success", result });
// });
// app.post("/test", async (req, res) => {
//   let user_id = 1;
//   let { nickname } = req.body;
//   if (!nickname) return res.status(400).json({ message: "nickname 없음" });

//   let result = await User.update({ nickname }, { where: { id: user_id } });
//   if (!result) return res.status(500).json({ message: "update 실패" });

//   res.status(200).json({ message: "success" });
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
