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

    const result = ticket.getPayload();
    if (!result?.sub) return null;

    return result;
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

    if (!response?.id) return null;
    return response;
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
  let authInfo = { isAuth: false };
  req.authInfo = authInfo;

  try {
    //external_type 알아내기
    const external_type = req.get("AuthType");
    if (!external_type) {
      console.log("no AuthType header");
      res.clearCookie("token");
      return next();
    }

    // Authorization 헤더에서 토큰 찾기
    let token;

    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("fail to get token in header");
      res.clearCookie("token");
      return next();
    }

    let isVerified;
    if (external_type === "google") {
      let userInfo = await googleVerify(token);
      if (!userInfo) {
        console.log("fail to verify");
        return next();
      }

      let external_id = userInfo?.sub;

      isVerified = await userDB.findUserById(external_type, external_id);
    } else if (external_type === "naver") {
      let userInfo = await naverVerify(token);

      if (userInfo) {
        let external_id = userInfo?.id;
        isVerified = await userDB.findUserById(external_type, external_id);
      } else {
        //refresh token으로 갱신
        let refresh_token = req?.cookies?.token;
        if (!refresh_token) {
          console.log("fail to get refresh_token in cookie");
          return next();
        }

        let accToken = await naverRefresh(refresh_token);
        if (!accToken) {
          console.log("fail to get access_token by refresh_token");
          res.clearCookie("token");
          return next();
        }

        let userInfo = await naverVerify(accToken);
        if (userInfo) {
          let external_id = userInfo?.id;
          isVerified = await userDB.findUserById(external_type, external_id);

          if (isVerified) {
            res.clearCookie("token");
            authInfo.newToken = accToken;
          }
        }
      }
    }

    if (!isVerified) {
      console.log("fail to get userInfo from DB");
      res.clearCookie("token");
      return next();
    } else {
      authInfo.isAuth = true;
      req.user = isVerified;
      return next();
    }
  } catch (err) {
    console.error(err);
    console.log("error in process of auth api");
    res.clearCookie("token");
    return next();
  }
}

// 유저만 가능
async function userAuth(req, res, next) {
  let authInfo = { isAuth: false };
  req.authInfo = authInfo;

  try {
    //external_type 알아내기
    const external_type = req.get("AuthType");
    if (!external_type) {
      res.clearCookie("token");
      return res.status(400).json({ message: "no AuthType header", authInfo });
    }

    // Authorization 헤더에서 토큰 찾기
    let token;

    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.clearCookie("token");
      return res
        .status(400)
        .json({ message: "fail to get token in header", authInfo });
    }

    let isVerified;
    if (external_type === "google") {
      let userInfo = await googleVerify(token);
      if (!userInfo) {
        return res.status(400).json({ message: "fail to verify", authInfo });
      }

      let external_id = userInfo?.sub;
      isVerified = await userDB.findUserById(external_type, external_id);
    } else if (external_type === "naver") {
      let userInfo = await naverVerify(token);

      if (userInfo) {
        let external_id = userInfo?.id;
        isVerified = await userDB.findUserById(external_type, external_id);
      } else {
        //refresh token으로 갱신
        let refresh_token = req?.cookies?.token;
        if (!refresh_token)
          return res.status(400).json({
            message: "fail to get refresh_token in cookie",
            authInfo,
          });

        let accToken = await naverRefresh(refresh_token);
        if (!accToken) {
          res.clearCookie("token");
          return res.status(400).json({
            message: "fail to get access_token by refresh_token",
            authInfo,
          });
        }

        let userInfo = await naverVerify(accToken);
        if (userInfo) {
          let external_id = userInfo?.id;
          isVerified = await userDB.findUserById(external_type, external_id);

          if (isVerified) {
            res.clearCookie("token");
            authInfo.newToken = accToken;
          }
        }
      }
    }

    if (!isVerified) {
      res.clearCookie("token");
      return res
        .status(400)
        .json({ message: "fail to get userInfo from DB", authInfo });
    } else {
      authInfo.isAuth = true;
      req.user = isVerified;
      return next();
    }
  } catch (err) {
    console.error(err);
    res.clearCookie("token");
    return res.status(500).json({ message: err, authInfo });
  }
}

//네이버api 참고: https://developers.naver.com/docs/login/api/api.md

module.exports = { googleVerify, naverVerify, auth, userAuth };
