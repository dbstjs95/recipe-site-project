const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const userDB = require("../db/user");

const googleVerify = async (token) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  try {
    let ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    if (!ticket) return null;

    const { sub } = ticket.getPayload();
    if (!sub) return null;

    return sub;
  } catch (err) {
    return null;
  }
};

const naverVerify = async (token) => {
  try {
    const {
      data: { response },
    } = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { id } = response;

    if (!id) return null;
    return id;
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

// 비회원도 가능
async function auth(req, res, next) {
  try {
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
      console.log("fail to get token in header");
      next();
    }

    let isVerified;
    if (external_type === "google") {
      let external_id = await googleVerify(token);
      if (!external_id) {
        console.log("fail to verify");
        next();
      }

      isVerified = await userDB.findUserById(external_type, external_id);
    } else if (external_type === "naver") {
      let external_id = await naverVerify(token);

      if (external_id) {
        isVerified = await userDB.findUserById(external_type, external_id);
      } else {
        //refresh token으로 갱신

        let cookie = req.headers.cookie;
        let refresh_token = cookie.split("=")[1];
        if (!refresh_token) {
          console.log("fail to get refresh_token in cookie");
          next();
        }

        let accToken = await naverRefresh(refresh_token);
        if (!accToken) {
          console.log("fail to get access_token by refresh_token");
          next();
        }

        let external_id = await naverVerify(accToken);
        if (external_id) {
          isVerified = await userDB.findUserById(external_type, external_id);

          if (isVerified) {
            res.setHeader("Set-Cookie", "");
            req.newToken = accToken;
          }
        }
      }
    }

    if (!isVerified) {
      console.log("fail to get userInfo from DB");
      next();
    } else {
      req.user = isVerified;
      next();
    }
  } catch (err) {
    console.error(err);
    console.log("error in process of auth api");
    next();
  }
}

// 유저만 가능
async function userAuth(req, res, next) {
  try {
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
      let external_id = await googleVerify(token);
      if (!external_id)
        return res
          .status(400)
          .json({ message: "fail to verify", isAuth: false });

      isVerified = await userDB.findUserById(external_type, external_id);
    } else if (external_type === "naver") {
      let external_id = await naverVerify(token);

      if (external_id) {
        isVerified = await userDB.findUserById(external_type, external_id);
      } else {
        //refresh token으로 갱신

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

        let external_id = await naverVerify(accToken);
        if (external_id) {
          isVerified = await userDB.findUserById(external_type, external_id);

          if (isVerified) {
            res.setHeader("Set-Cookie", "");
            req.newToken = accToken;
          }
        }
      }
    }

    if (!isVerified) {
      return res
        .status(400)
        .json({ message: "fail to get userInfo from DB", isAuth: false });
    } else {
      req.user = isVerified;
      next();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err, isAuth: false });
  }
}

//네이버api 참고: https://developers.naver.com/docs/login/api/api.md

module.exports = { auth, userAuth };
