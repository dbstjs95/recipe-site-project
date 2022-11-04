const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const googleVerify = async (token) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  try {
    let isAuthenticated = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    if (!isAuthenticated) return null;
    return true;
  } catch (err) {
    return null;
  }
};

const naverVerify = async (token) => {
  try {
    const {
      data: { message },
    } = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (message === "success") return true;
    return null;
  } catch (err) {
    return null;
  }
};

const naverRefresh = async (token) => {
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

  const url = `https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&refresh_token=${token}`;

  const result = await axios.get(url);
  const { access_token, token_type, expires_in } = result.data;

  if (!access_token) return null;
  return access_token;
};

module.exports = async function auth(req, res) {
  //external_type 알아내기
  const external_type = req.query.type;
  if (!external_type)
    return res.status(400).json({ message: "no query string 'type'" });

  // Authorization 헤더에서 토큰 찾기
  let token;

  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res
      .status(400)
      .json({ message: "fail to get token in header", isAuth: false });
  }

  let isVerified;
  if (external_type === "google") {
    isVerified = await googleVerify(token);

    if (!isVerified)
      return res.status(400).json({ message: "fail to verify", isAuth: false });
  } else if (external_type === "naver") {
    isVerified = await naverVerify(token);
    //refresh token으로 갱신
    if (!isVerified) {
      try {
        let cookie = req.headers.cookie;
        let refresh_token = cookie.split("=")[1];
        if (!refresh_token)
          return res.status(400).json({
            message: "fail to get refresh_token in cookie",
            isAuth: false,
          });
        let accToken = await naverRefresh(refresh_token);
        if (!accToken)
          return res.status(400).json({
            message: "fail to get access_token by refresh_token",
            isAuth: false,
          });
        isVerified = await naverVerify(accToken);
        if (!isVerified)
          return res
            .status(400)
            .json({ message: "fail to verify", isAuth: false });
        else {
          res.setHeader("Set-Cookie", "");
          return res.status(200).json({
            message: "success",
            isAuth: true,
            access_token: accToken,
          });
        }
      } catch (err) {
        return res.status(400).json({ message: err, isAuth: false });
      }
    }
  }
  return res.status(200).json({ message: "success", isAuth: true });
};

//네이버api 참고: https://developers.naver.com/docs/login/api/api.md
