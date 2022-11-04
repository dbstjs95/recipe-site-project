"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipe_ingr_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipe_ingr_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Recipe_ingrs",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipe_ingr_details");
  },
};
