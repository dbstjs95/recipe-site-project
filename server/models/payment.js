"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Payment.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Payment.init(
    {
      imp_uid: DataTypes.STRING,
      merchant_uid: DataTypes.STRING,
      pay_method: DataTypes.STRING,
      paid_amount: DataTypes.INTEGER,
      cancel_amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
      timestamps: true,
    }
  );
  return Payment;
};
