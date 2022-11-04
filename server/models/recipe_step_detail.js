"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe_step_detail extends Model {
    static associate(models) {
      Recipe_step_detail.belongsTo(models.Recipe_step, {
        foreignKey: "recipe_step_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_step_detail.init(
    {
      text: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recipe_step_detail",
    }
  );
  return Recipe_step_detail;
};
