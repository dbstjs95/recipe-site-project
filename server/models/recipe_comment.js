"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe_comment extends Model {
    static associate(models) {
      Recipe_comment.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe_comment.belongsTo(models.Recipe, {
        foreignKey: "recipe_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_comment.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recipe_comment",
      timestamps: true,
      updatedAt: false,
    }
  );
  return Recipe_comment;
};
