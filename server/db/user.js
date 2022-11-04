const { User } = require("../models");

async function findUserById(type, id) {
  return await User.findOne({
    where: { external_type: type, external_id: id },
  });
}
async function findUserByUserId(id) {
  return await User.findOne({
    where: { id },
  });
}

async function CreateUser(data) {
  return await User.create(data);
}

module.exports = { findUserById, findUserByUserId, CreateUser };
