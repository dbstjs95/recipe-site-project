const { Op, fn, col, literal } = require("sequelize");
const { Payment } = require("../models");

async function createPayment(data) {
  try {
    let isCreated = await Payment.create(data);
    if (!isCreated) return "error: isCreated";

    return { message: "success", paymentId: isCreated?.id };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function findPaymentData(id, merchant_uid = null) {
  try {
    let customWhere = merchant_uid ? { id, merchant_uid } : { id };

    let result = await Payment.findOne({
      where: customWhere,
      attributes: [
        "imp_uid",
        "merchant_uid",
        "paid_amount",
        "cancel_amount",
        "status",
        [
          fn("DATE_FORMAT", col("Payment.createdAt"), "%Y-%m-%d %H:%i:%s"),
          "created_at",
        ],
      ],
    });

    if (!result) return "error: result";

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// 결제 정보 업데이트(환불후)
async function updatePaymentData(merchant_uid, data) {
  try {
    let result = await Payment.update(data, { where: { merchant_uid } });

    if (!result) return "error: result";
    if (result[0] === 0) return "error: 업데이트된 row가 없음.";
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { createPayment, findPaymentData, updatePaymentData };
