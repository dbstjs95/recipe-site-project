"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Payments",
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
        class_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          unique: "actions_unique",
          onDelete: "CASCADE",
          references: {
            model: "Classes",
            key: "id",
          },
        },
        imp_uid: {
          type: Sequelize.STRING,
        },
        merchant_uid: {
          type: Sequelize.STRING,
        },
        pay_method: {
          type: Sequelize.STRING,
        },
        paid_amount: {
          type: Sequelize.INTEGER,
        },
        cancel_amount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.STRING,
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
            fields: ["user_id", "class_id"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
