"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipe_ingrs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipe_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Recipes",
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipe_ingrs");
  },
};
