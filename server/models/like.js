"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Like.belongsTo(models.Recipe, {
        foreignKey: "recipe_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Like.init(
    {},
    {
      sequelize,
      modelName: "Like",
      timestamps: true,
      createdAt: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "recipe_id"],
        },
      ],
    }
  );
  return Like;
};
