"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */

const hashingPassword = async (pass) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await hashingPassword("Password123!");
    return queryInterface.bulkInsert("Users", [
      {
        id: 1,
        role_id: 1,
        username: "user_pertama",
        email: "user_pertama@gmail.com",
        phone: "089652433201",
        image_profile: null,
        by_form: true,
        is_active: true,
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        role_id: 2,
        username: "user_kedua",
        email: "user_kedua@gmail.com",
        phone: "089652433202",
        image_profile: null,
        by_form: true,
        is_active: true,
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 3,
        role_id: 2,
        username: "user_ketiga",
        email: "user_ketiga@gmail.com",
        phone: "089652433203",
        image_profile: null,
        by_form: true,
        is_active: true,
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
