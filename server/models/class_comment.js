"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class_comment extends Model {
    static associate(models) {
      Class_comment.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Class_comment.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Class_comment.init(
    {
      content: DataTypes.STRING(10000),
    },
    {
      sequelize,
      modelName: "Class_comment",
      timestamps: true,
      updatedAt: false,
    }
  );
  return Class_comment;
};
