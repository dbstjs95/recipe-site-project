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

async function createUser(data) {
  return await User.create(data);
}

async function changeUserInfo(data) {
  // 테스트용
  let user_id = 1;

  try {
    let result = await User.update(data, { where: { id: user_id } });
    if (!result) return null;
    return "success";
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { findUserById, findUserByUserId, createUser, changeUserInfo };
