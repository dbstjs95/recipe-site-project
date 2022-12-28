const router = require("express").Router();
require("dotenv").config();
const payDB = require("../db/pay");
const { userAuth } = require("../middleware/auth");
const axios = require("axios");

// 결제정보 저장
router.post("/:classId", userAuth, async (req, res) => {
  let authInfo = req?.authInfo;
  let userId = req?.user?.id;

  let { classId } = req.params;
  let data = req.body;
  if (!data)
    return res
      .status(400)
      .json({ message: "can't find the payment data", authInfo });

  if (!data?.imp_uid || !data?.merchant_uid || !data?.paid_amount) {
    return res.status(400).json({
      message:
        "can't find the required data(imp_uid or merchant_uid or paid_amount)",
      authInfo,
    });
  }

  let paymentInfo = { ...data, user_id: userId, class_id: classId };

  let result = await payDB.createPayment(paymentInfo);

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result, authInfo });
  }

  result.status = 200;
  result.authInfo = authInfo;
  return res.status(200).json(result);
});

// 결제완료정보 불어오기
router.get("/:paymentId", async (req, res) => {
  let authInfo = req?.authInfo;
  let { paymentId } = req.params;

  let result = await payDB.findPaymentData(paymentId);

  if (!result)
    return res.status(500).json({ message: "server error", authInfo });

  if (typeof result === "string" && result.startsWith("error")) {
    return res.status(400).json({ message: "fail", result, authInfo });
  }

  return res
    .status(200)
    .json({ message: "success", status: 200, payment: result, authInfo });
});

// 결제정보저장후 환불
router.post("/:paymentId/cancel", async (req, res) => {
  let authInfo = req?.authInfo;

  let body = req.body;
  if (!body || !body?.reason || !body?.merchant_uid)
    return res
      .status(400)
      .json({ message: "can't find the refund data.", authInfo });

  let { reason, merchant_uid } = body;
  let { paymentId } = req.params;

  // 액세스 토큰(access token) 발급 받기
  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      imp_key: process.env.IAMPORT_IMP_KEY,
      imp_secret: process.env.IAMPORT_IMP_SECRET,
    },
  });

  const { access_token } = getToken.data.response; // 인증 토큰

  // 디비에서 결제 정보 조회
  const dbData = await payDB.findPaymentData(paymentId, merchant_uid);
  if (!dbData)
    return res.status(500).json({
      message: "디비에서 결제 정보 조회 실패: server error",
      authInfo,
    });
  if (typeof dbData === "string" && dbData.startsWith("error"))
    return res
      .status(400)
      .json({ message: "디비에서 결제 정보 조회 실패", dbData, authInfo });

  const { imp_uid, paid_amount, cancel_amount, status: dbStatus } = dbData;
  const cancelableAmount = Number(paid_amount) - Number(cancel_amount);
  if (dbStatus === "cancelled" || cancelableAmount <= 0) {
    return res
      .status(400)
      .json({ message: "이미 환불된 결제건 입니다.", authInfo });
  }

  const getCancelData = await axios({
    url: "https://api.iamport.kr/payments/cancel",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
    },
    data: {
      reason, // 가맹점 클라이언트로부터 받은 환불사유
      imp_uid, // imp_uid를 환불 `unique key`로 입력
      amount: paid_amount, // 가맹점 클라이언트로부터 받은 환불금액
      checksum: cancelableAmount, // [권장] 환불 가능 금액 입력
    },
  });

  const { response } = getCancelData.data;
  const { merchant_uid: iamport_merchant_uid, status, cancelled_at } = response;

  if (merchant_uid !== iamport_merchant_uid) {
    return res.status(500).json({
      message:
        "환불결과: DB merchant_uid와 iamport merchant_uid가 일치하지 않습니다.",
      authInfo,
    });
  }

  let dataToUpdate = {
    status,
    cancel_amount: paid_amount,
  };

  let result = await payDB.updatePaymentData(merchant_uid, dataToUpdate);
  if (!result) return res.status(500).json({ message: "server error" });
  if (typeof result === "string" && result.startsWith("error"))
    return res.status(400).json({ message: "fail", result, authInfo });

  return res.status(200).json({ message: "success", status: 200, authInfo });
});

// 결제정보저장 실패후 결제 취소
router.post("/fail/:classId", async (req, res) => {
  let { classId } = req.params;
  let { reason, imp_uid, amount } = req.body;

  if (!reason || !imp_uid || !amount)
    return res.status(400).json({
      message: "reason, imp_uid, amount의 정보가 모두 있어야 합니다.",
    });

  // 액세스 토큰(access token) 발급 받기
  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      imp_key: process.env.IAMPORT_IMP_KEY,
      imp_secret: process.env.IAMPORT_IMP_SECRET,
    },
  });

  const { access_token } = getToken.data.response; // 인증 토큰

  // DB에서 클래스 가격 추출
  let price = await payDB.findClassPrice(classId);
  if (price !== 0 && !price)
    return res
      .status(500)
      .json({ message: "클래스의 가격을 찾을 수 없습니다." });

  const getCancelData = await axios({
    url: "https://api.iamport.kr/payments/cancel",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
    },
    data: {
      reason, // 가맹점 클라이언트로부터 받은 환불사유
      imp_uid, // imp_uid를 환불 `unique key`로 입력
      amount, // 가맹점 클라이언트로부터 받은 환불금액
      checksum: price,
    },
  });

  const { response } = getCancelData.data;
  const { status } = response;

  if (status === "cancelled")
    return res.status(200).json({ message: "success" });

  return res.status(500).json({ message: "fail" });
});

module.exports = router;
