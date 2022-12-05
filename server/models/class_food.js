"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class_food extends Model {
    static associate(models) {
      Class_food.belongsTo(models.Class, {
        foreignKey: "class_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Class_food.init(
    {
      name: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class_food",
      timestamps: false,
    }
  );
  return Class_food;
};
