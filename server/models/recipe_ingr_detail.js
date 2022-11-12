"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe_ingr_detail extends Model {
    static associate(models) {
      Recipe_ingr_detail.belongsTo(models.Recipe_ingr, {
        foreignKey: "recipe_ingr_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe_ingr_detail.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recipe_ingr_detail",
      timestamps: false,
    }
  );
  return Recipe_ingr_detail;
};
