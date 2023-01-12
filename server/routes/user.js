const router = require("express").Router();
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const userDB = require("../db/user");
const { googleVerify, naverVerify, userAuth } = require("../middleware/auth");

// 구글 로그인
router.post("/login/google", (req, res) => {
  const authHeader = req.get("Authorization");

  let id_token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    id_token = authHeader.split(" ")[1];
  }

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
    if (!isUser) {
      // 회원이 아니라면 --> 회원가입
      return res.status(202).json({
        isRegistered: false,
        status: 202,
        userInfo: { nickname: name, email, external_type: "google" },
      });
    }

    return res
      .status(200)
      .json({ message: "success", userInfo: isUser, status: 200 });
  }

  verify().catch((err) => {
    console.error(err);
    return res.status(500).json({
      message: "server error",
    });
  });
});

// 네이버 로그인
router.post("/login/naver", async (req, res) => {
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

    const { id, nickname, email, profile_image = "" } = response;

    if (!id) return res.status(400).json("fail to get external_id");

    let isUser = await userDB.findUserById("naver", id);
    if (!isUser) {
      //회원이 아닌 경우 --> 회원가입
      // res.header({
      //   authtype: "naver",
      //   act: access_token,
      //   rft: refresh_token,
      // });

      // res.set("Access-Control-Expose-Headers", ["authtype", "act", "rft"]);
      // return res.status(202).json({
      //   isRegistered: false,
      //   status: 202,
      //   userInfo: {
      //     nickname,
      //     email,
      //   },
      // });

      return res.status(202).json({
        isRegistered: false,
        status: 202,
        userInfo: {
          nickname,
          email,
          external_type: "naver",
        },
        token: {
          act: access_token,
          rft: refresh_token,
        },
      });
    }

    res.cookie("token", refresh_token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    return res.json({
      message: "success",
      token: access_token,
      userInfo: isUser,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "server error",
    });
  }
});

// 회원가입
router.post("/register", async (req, res) => {
  let data = req.body;
  let authHd = req.get("Authorization");

  if (!data || !authHd)
    return res
      .status(400)
      .json({ message: "can't find data to register or Authorization header" });

  let token = authHd?.split(" ")[1];
  let rft = req.get("Rft");

  let { external_type, nickname, email } = data;

  if (!token || !external_type)
    return res
      .status(400)
      .json({ message: "can't find token or external_type" });

  let userData;
  if (external_type === "google") {
    userData = await googleVerify(token);
  } else if (external_type === "naver") {
    userData = await naverVerify(token);
  }

  if (!userData) return res.status(400).json({ message: "fail to verify" });

  let userInfo = await userDB.createUser({
    external_type,
    external_id: external_type === "google" ? userData?.sub : userData?.id,
    nickname,
    email,
    profile_img:
      external_type === "google" ? userData?.picture : userData?.profile_image,
  });

  if (!userInfo) return res.status(500).json({ message: "server error" });
  if (typeof userInfo === "string" && userInfo?.startsWith("error"))
    return res.status(400).json({ message: "fail", userInfo });

  if (rft)
    res.cookie("token", rft, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
  return res.status(200).json({ message: "success", status: 200, userInfo });
});

// 마이페이지: 프로필 변경
router.post("/change", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let data = req.body;
  let result = await userDB.changeUserInfo(data, userId);

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });
  if (typeof result === "string" && result?.startsWith("error"))
    return res.status(400).json({ message: "fail", authInfo });

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

// 마이페이지: 내 레시피 목록
router.get("/recipe", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let { public, order_by = "created_at", offset = 0, limit = 10 } = req.query;

  let result = await userDB.getMyRecipeList(
    userId,
    Number(public),
    order_by,
    Number(offset),
    Number(limit)
  );
  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result, authInfo });
  }

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

// 마이페이지: 좋아요 리스트
router.get("/likes", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let { offset = 0, limit = 10 } = req.query;

  let result = await userDB.getMyLikes(userId, Number(offset), Number(limit));

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result, authInfo });
  }

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

// 회원정보수정
router.put("/", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let data = req.body;
  if (!data)
    return res
      .status(400)
      .json({ message: "can't find the data to modify userData", authInfo });

  let result = await userDB.changeUserInfo(data, userId);

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result?.startsWith("error"))
    return res.status(400).json({ message: "fail", result, authInfo });

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

// 회원탈퇴
router.delete("/", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;
  let cookie = req?.cookies?.token;

  let external_type = req?.user?.external_type;
  let accToken = authInfo?.newToken || req.get("Authorization")?.split(" ")[1];

  if (!userId || !external_type)
    return res
      .status(400)
      .json({ message: "fail to get userId or external_type", authInfo });

  if (external_type === "naver") {
    // 네이버
    let url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&access_token=${accToken}&service_provider=NAVER`;

    let deleteResult = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (!deleteResult || deleteResult?.result !== "success")
      return res
        .status(500)
        .json({ message: "엑세스 토큰 삭제 요청 실패", authInfo });
  } else {
    // 구글: https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
  }

  let result = await userDB.deleteUser(userId);
  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result?.startsWith("error"))
    return res.status(400).json({ message: "fail", result, authInfo });

  if (cookie) {
    res.clearCookie("token");
  }
  result.status = 200;
  return res.status(200).json(result);
});

// 로그아웃
router.post("/logout", userAuth, async (req, res) => {
  let cookie = req?.cookies?.token;

  if (cookie) {
    res.clearCookie("token");
  }
  return res.status(200).json({ message: "success", status: 200 });
});

// 클래스 구매 목록
router.get("/classes", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let { offset = 0, limit = 15 } = req.query;

  let result = await userDB.getPaidClassList(
    userId,
    Number(offset),
    Number(limit)
  );

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result?.startsWith("error"))
    return res.status(400).json({ message: "fail", result, authInfo });

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

module.exports = router;
