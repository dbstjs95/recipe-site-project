const { User, Recipe, Like, Class, Payment } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

async function findUserById(type, id) {
  return await User.findOne({
    where: { external_type: type, external_id: id },
    attributes: {
      exclude: ["external_id"],
    },
  });
}
async function findUserByUserId(id) {
  return await User.findOne({
    where: { id },
  });
}

async function createUser(data) {
  try {
    let isCreated = await User.create(data);
    if (!isCreated) return "error: isCreated";
    delete isCreated.dataValues.external_id;
    return isCreated;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function changeUserInfo(data, user_id) {
  try {
    let result = await User.update(data, { where: { id: user_id } });
    if (!result) return "error: result";
    return { message: "success" };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteUser(user_id) {
  try {
    let result = await User.destroy({ where: { id: user_id } });
    if (!result) return "error: result";
    return { message: "success" };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getMyRecipeList(userId, public, order_by, offset, limit) {
  try {
    let customOrder;
    if (!public || order_by === "created_at") {
      customOrder = [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ];
    } else {
      customOrder = [
        ["like", "DESC"],
        ["id", "ASC"],
      ];
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
      order: customOrder,
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
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    if (!rowData) {
      return "error: count";
    }

    let count = rowData?.length;
    if (count === 0) return { count, list: [] };

    let likedRecipeIds;
    if (count > 0) {
      likedRecipeIds = rowData.map((item) => item?.dataValues?.recipe_id);
    }

    if (!likedRecipeIds) return "error: likedRecipeIds";

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
          attributes: ["nickname", "profile_img"],
        },
      ],
      order: [[fn("field", col("Recipe.id"), ...likedRecipeIds), "ASC"]],
      group: "Recipe.id",
      offset: offset,
    });

    if (!data) return "error: data";

    let limitedData = data?.slice(0, limit);

    let result = limitedData.map(({ dataValues: item }) => {
      let { nickname, profile_img } = item?.writer;
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

async function getPaidClassList(userId, offset, limit) {
  // Payment에서 user_id가 userId, status가 'paid'인 class_id를 최신순으로... (id, class_id)
  // 추출한 class_id의 Class 정보 추출하기(src, title, price)
  // offset이 0일 때, count 보내기
  try {
    let paymentRst = await Payment.findAll({
      where: { user_id: userId, status: "paid" },
      attributes: ["class_id", ["id", "payment_id"]],
      order: [["id", "DESC"]],
    });

    if (!paymentRst) return "error: paymentRst";

    if (paymentRst?.length === 0)
      return { message: "success", count: 0, list: [] };

    let classIds = paymentRst?.map((item) => item?.dataValues?.class_id);

    let classRst = await Class.findAll({
      where: { id: classIds },
      attributes: [
        ["header_img", "src"],
        ["header_title", "title"],
        "price",
        "deadline",
      ],
      order: [[fn("field", col("id"), ...classIds), "ASC"]],
      offset,
      limit,
    });

    if (!classRst) return "error: classRst";

    let result = classRst.map((item, idx) => {
      let temp = item?.dataValues;
      temp = { ...paymentRst[idx]?.dataValues, ...temp };
      return temp;
    });

    if (offset === 0) {
      let count = result?.length;
      return { message: "success", count, list: result };
    } else {
      return { message: "success", list: result };
    }
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
  deleteUser,
  getMyRecipeList,
  getMyLikes,
  getPaidClassList,
};
