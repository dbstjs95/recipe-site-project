"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe_step extends Model {
    static associate(models) {
      Recipe_step.belongsTo(models.Recipe, {
        foreignKey: "recipe_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_step.init(
    {
      order: DataTypes.INTEGER,
      text: DataTypes.STRING(10000),
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recipe_step",
      timestamps: false,
    }
  );
  return Recipe_step;
};
