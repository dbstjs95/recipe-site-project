"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class_party extends Model {
    static associate(models) {
      Class_party.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Class_party.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Class_party.init(
    {},
    {
      sequelize,
      modelName: "Class_party",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["class_id", "user_id"],
        },
      ],
    }
  );
  return Class_party;
};
