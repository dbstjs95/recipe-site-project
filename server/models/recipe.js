"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe.hasMany(models.Like, {
        foreignKey: "recipe_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe.hasMany(models.Recipe_ingr, {
        foreignKey: "recipe_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe.hasMany(models.Recipe_step, {
        foreignKey: "recipe_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Recipe.hasMany(models.Recipe_comment, {
        foreignKey: "recipe_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Recipe.init(
    {
      public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      category: DataTypes.STRING,
      header_img: DataTypes.STRING,
      header_title: DataTypes.STRING(500),
      header_desc: DataTypes.STRING(5000),
      servings: DataTypes.STRING,
      time: DataTypes.STRING,
      level: DataTypes.STRING,
      view: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
      timestamps: true,
    }
  );
  return Recipe;
};
