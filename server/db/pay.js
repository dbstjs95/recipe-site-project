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

async function findPaymentData(id) {
  try {
    let result = await Payment.findOne({
      where: { id },
      attributes: [
        "imp_uid",
        "merchant_uid",
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

module.exports = { createPayment, findPaymentData };
