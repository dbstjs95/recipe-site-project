"use strict";

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
      host_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Class_hosts",
          key: "id",
        },
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
      time_required: {
        type: Sequelize.DATE,
      },
      date_time: {
        type: Sequelize.DATE,
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
      intro: {
        type: Sequelize.STRING(3000),
      },
      post_start_date: {
        type: Sequelize.DATE,
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
