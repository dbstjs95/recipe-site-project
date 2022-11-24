const { User, Recipe, Like } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

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

async function getMyRecipeList(userId, public, order_by, offset, limit) {
  try {
    let customOrder;
    if (!public || order_by === "created_at") {
      customOrder = ["createdAt", "DESC"];
    } else {
      customOrder = ["like", "DESC"];
    }

    let count;
    if (offset === 0) {
      count = await Recipe.count({ where: { user_id: userId, public } });
    }

    let result = await Recipe.findAll({
      where: {
        user_id: userId,
        public,
      },
      attributes: [
        ["id", "recipe_id"],
        ["header_img", "src"],
        ["header_title", "title"],
        "view",
        [fn("COUNT", col("Likes.recipe_id")), "like"],
      ],
      include: [{ model: Like, attributes: [] }],
      order: [customOrder],
      offset: offset,
      group: "Recipe.id",
    });

    if (!result) return "error: result";

    let limitedResult = result?.slice(0, limit);

    if (offset === 0) {
      return { count, list: limitedResult };
    } else {
      return { list: limitedResult };
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getMyLikes(userId, offset, limit) {
  try {
    let rowData = await Like.findAll({
      where: { user_id: userId },
      attributes: ["recipe_id"],
      order: [["createdAt", "DESC"]],
    });

    let count = rowData.length;

    let likedRecipeIds;
    if (count > 0) {
      likedRecipeIds = rowData.map((item) => item?.dataValues?.recipe_id);
    } else {
      return { list: [] };
    }

    let data = await Recipe.findAll({
      where: { id: likedRecipeIds },
      attributes: [
        ["id", "recipe_id"],
        "view",
        ["header_img", "src"],
        ["header_title", "title"],
        [
          fn("DATE_FORMAT", col("Recipe.createdAt"), "%Y-%m-%d %H:%i:%s"),
          "created_at",
        ],
        [fn("COUNT", col("Likes.recipe_id")), "like"],
      ],
      include: [
        {
          model: Like,
          attributes: [],
        },
        {
          model: User,
          as: "writer",
          attributes: ["profile_img", "nickname"],
        },
      ],
      order: [[fn("field", col("Recipe.id"), ...likedRecipeIds), "ASC"]],
      group: "Recipe.id",
      offset: offset,
    });

    if (!data) return "error: data";

    let limitedData = data?.slice(0, limit);

    let result = limitedData.map(({ dataValues: item }) => {
      let { profile_img, nickname } = item?.writer;
      let temp = [profile_img, nickname];
      delete item.writer;
      return { ...item, userInfo: temp };
    });

    if (!result) return "error: result";

    if (offset === 0) return { count, list: result };
    return { list: result };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  findUserById,
  findUserByUserId,
  createUser,
  changeUserInfo,
  getMyRecipeList,
  getMyLikes,
};
