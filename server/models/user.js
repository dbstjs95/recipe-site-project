"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Recipe, {
        foreignKey: "user_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Like, {
        foreignKey: "user_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Class_party, {
        foreignKey: "user_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Recipe_comment, {
        foreignKey: "user_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Class_comment, {
        foreignKey: "user_id",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      nickname: DataTypes.STRING(20),
      email: DataTypes.STRING(30),
      profile_img: DataTypes.STRING,
      profile_desc: DataTypes.STRING,
      external_type: DataTypes.STRING(10),
      external_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
    }
  );
  return User;
};
