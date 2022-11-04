"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe_ingr extends Model {
    static associate(models) {
      Recipe_ingr.belongsTo(models.Recipe, {
        foreignKey: "recipe_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe_ingr.hasMany(models.Recipe_ingr_detail, {
        foreignKey: "recipe_ingr_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_ingr.init(
    {
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recipe_ingr",
    }
  );
  return Recipe_ingr;
};
