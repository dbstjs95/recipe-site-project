const { Op, fn, col, literal } = require("sequelize");
const { Like } = require("../models");

async function addLike(userId, recipeId) {
  try {
    let isCreated = await Like.create({
      user_id: userId,
      recipe_id: recipeId,
    });

    if (!isCreated) return "error: isCreated";

    let like = await Like.count({ where: { recipe_id: recipeId } });

    return { like };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteLike(userId, recipeId) {
  try {
    let isDeleted = await Like.destroy({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });

    if (!isDeleted) return "error: isDeleted";

    let like = await Like.count({ where: { recipe_id: recipeId } });

    return { like };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { addLike, deleteLike };
