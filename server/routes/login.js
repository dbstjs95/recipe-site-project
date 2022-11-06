const router = require("express").Router();
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const userDB = require("../db/user");

router.post("/google", (req, res) => {
  const { id_token } = req.body;
  if (!id_token)
    return res.status(400).json({ message: "failed to get id_token" });

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const { sub, email, email_verified, name, picture } = ticket.getPayload();

    if (!sub)
      return res.status(400).json({ message: "fail to get external_id" });

    let isUser = await userDB.findUserById("google", sub);

    let userInfo;
    if (isUser) {
      //이미 회원인 경우 --> 로그인
      userInfo = isUser;
    } else {
      //회원이 아닌 경우 --> 회원가입
      userInfo = await userDB.CreateUser({
        external_type: "google",
        external_id: sub,
        nickname: name,
        email,
        profileImg: picture,
      });
    }

    if (!userInfo)
      return res.status(500).json({ message: "fail to get userInfo from DB" });

    return res.status(200).json({ message: "success", userInfo });
  }

  verify().catch((err) => {
    console.error(err);
    return res.status(500).json({
      message: "server error fail",
    });
  });
});

router.post("/naver", async (req, res) => {
  try {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

    const { code, state } = req.body;

    if (!code || !state)
      return res.status(400).json({ message: "fail to find code or state" });

    const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;

    const result = await axios.get(url);
    //네이버 expires_in는 초단위임 --> 3600초 --> 1시간
    const { access_token, refresh_token, expires_in } = result.data;

    if (!access_token)
      return res.status(400).json({ message: "fail to get access_token" });

    const {
      data: { response },
    } = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response)
      return res.status(400).json({ message: "fail to verify naver token" });

    const { id, nickname, email } = response;

    if (!id) return res.status(400).json("fail to get external_id");

    let isUser = await userDB.findUserById("naver", id);

    let userInfo;
    if (isUser) {
      //이미 회원인 경우 --> 로그인
      userInfo = isUser;
    } else {
      //회원이 아닌 경우 --> 회원가입
      userInfo = await userDB.CreateUser({
        external_type: "naver",
        external_id: id,
        nickname,
        email,
      });
    }

    if (!userInfo)
      return res.status(500).json({ message: "fail to get userInfo from DB" });

    res.setHeader("Set-Cookie", `token=${refresh_token}`);
    return res
      .status(200)
      .json({ message: "success", token: access_token, userInfo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "server error fail",
    });
  }
});

module.exports = router;
