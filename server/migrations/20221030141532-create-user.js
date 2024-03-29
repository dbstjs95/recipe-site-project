"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        nickname: {
          type: Sequelize.STRING(20),
        },
        email: {
          type: Sequelize.STRING(30),
        },
        profile_img: {
          type: Sequelize.STRING,
        },
        profile_desc: {
          type: Sequelize.STRING,
        },
        external_type: {
          type: Sequelize.STRING(10),
          unique: "actions_unique",
        },
        external_id: {
          type: Sequelize.STRING,
          unique: "actions_unique",
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
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ["external_type", "external_id"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
