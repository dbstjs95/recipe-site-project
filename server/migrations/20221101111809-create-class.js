"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING,
      },
      header_img: {
        type: Sequelize.STRING,
      },
      header_title: {
        type: Sequelize.STRING(500),
      },
      header_desc: {
        type: Sequelize.STRING(1000),
      },
      time: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      limit: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      place: {
        type: Sequelize.STRING(500),
      },
      email: {
        type: Sequelize.STRING,
      },
      intro: {
        type: Sequelize.STRING(3000),
      },
      host_img: {
        type: Sequelize.STRING,
      },
      host_desc: {
        type: Sequelize.STRING(5000),
      },
      host_details: {
        type: Sequelize.STRING(2000),
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
    await queryInterface.dropTable("Classes");
  },
};
