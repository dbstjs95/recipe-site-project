"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class_host extends Model {
    static associate(models) {
      Class_host.hasMany(models.Class, {
        foreignKey: "host_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Class_host.init(
    {
      name: DataTypes.STRING(100),
      email: DataTypes.STRING,
      img: DataTypes.STRING,
      desc: DataTypes.STRING(5000),
      details: DataTypes.STRING(2000),
      contact: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class_host",
      timestamps: true,
    }
  );
  return Class_host;
};
