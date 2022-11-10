"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.hasMany(models.Class_food, {
        foreignKey: "class_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Class.hasMany(models.Class_party, {
        foreignKey: "class_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Class.hasMany(models.Class_comment, {
        foreignKey: "class_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Class.init(
    {
      category: DataTypes.STRING,
      header_img: DataTypes.STRING,
      header_title: DataTypes.STRING(500),
      header_desc: DataTypes.STRING(1000),
      time: DataTypes.STRING,
      date: DataTypes.STRING,
      limit: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      place: DataTypes.STRING(200),
      email: DataTypes.STRING,
      intro: DataTypes.STRING(3000),
      host_img: DataTypes.STRING,
      host_desc: DataTypes.STRING(5000),
      host_details: DataTypes.STRING(2000),
    },
    {
      sequelize,
      modelName: "Class",
      timestamps: true,
    }
  );
  return Class;
};
