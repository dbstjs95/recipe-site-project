"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Class_host, {
        foreignKey: "host_id",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: "classHost",
      });
      Class.hasMany(models.Class_food, {
        foreignKey: "class_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: "classFoods",
      });
      Class.hasMany(models.Class_comment, {
        foreignKey: "class_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Class.hasMany(models.Payment, {
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
      time_required: DataTypes.INTEGER,
      date_time: DataTypes.DATE,
      limit: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      place: DataTypes.STRING(500),
      intro: DataTypes.STRING(3000),
      post_start_date: DataTypes.DATE,
      deadline: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Class",
      timestamps: true,
    }
  );
  return Class;
};
