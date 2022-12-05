const router = require("express").Router();
require("dotenv").config();
const payDB = require("../db/pay");
const { userAuth } = require("../middleware/auth");

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

module.exports = router;
