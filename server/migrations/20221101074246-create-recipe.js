"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
        },
      },
      public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      category: {
        type: Sequelize.STRING,
      },
      header_img: {
        type: Sequelize.STRING,
      },
      header_title: {
        type: Sequelize.STRING,
      },
      header_desc: {
        type: Sequelize.STRING,
      },
      servings: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.STRING,
      },
      view: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipes");
  },
};
