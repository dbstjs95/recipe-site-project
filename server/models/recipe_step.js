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
      Recipe_step.hasMany(models.Recipe_step_detail, {
        foreignKey: "recipe_step_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_step.init(
    {
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Recipe_step",
    }
  );
  return Recipe_step;
};
