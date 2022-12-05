"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Likes",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          unique: "actions_unique",
          onDelete: "CASCADE",
          references: {
            model: "Users",
            key: "id",
          },
        },
        recipe_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          unique: "actions_unique",
          onDelete: "CASCADE",
          references: {
            model: "Recipes",
            key: "id",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("now"),
        },
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ["user_id", "recipe_id"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Likes");
  },
};
