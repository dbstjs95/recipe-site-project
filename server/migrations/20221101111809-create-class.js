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
        type: Sequelize.STRING,
      },
      header_desc: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      intro: {
        type: Sequelize.STRING,
      },
      host_img: {
        type: Sequelize.STRING,
      },
      host_desc: {
        type: Sequelize.STRING,
      },
      host_details: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Classes");
  },
};
