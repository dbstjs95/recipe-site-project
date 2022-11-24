const { Op, fn, col, literal } = require("sequelize");
const {
  User,
  Class_host,
  Class,
  Class_food,
  Class_party,
  Class_comment,
} = require("../models");
const moment = require("moment");

//https://stackoverflow.com/questions/37817808/counting-associated-entries-with-sequelize
async function getClassList(category, offset, limit) {
  try {
    let result = await Class.findAll({
      where: {
        category: {
          [Op.like]: category === "전체" ? "%" : `%${category}%`,
        },
      },
      attributes: [
        ["id", "class_id"],
        ["header_img", "src"],
        ["header_title", "title"],
        "price",
        "deadline",
        [fn("COUNT", col("Class.id")), "sales"],
      ],
      include: [
        {
          model: Class_party,
          attributes: [],
        },
      ],
      group: ["Class.id"],
      order: [["deadline"]],
      offset: offset,
      limit: limit,
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// https://sebhastian.com/sequelize-date-format/
async function getClass(id) {
  // 테스트
  let user_id;

  try {
    let parties = await Class_party.findAll({
      where: {
        class_id: id,
      },
      attributes: ["user_id"],
    });

    if (!parties) return "error: parties";

    let partyUsers = parties?.map((item) => item?.dataValues?.user_id);
    let sales = partyUsers.length;
    let isPurchased = partyUsers.some((item) => item === user_id);

    let result = await Class.findByPk(id, {
      attributes: [
        "id",
        "header_img",
        "header_title",
        "header_desc",
        "price",
        "time_required",
        [fn("DATE_FORMAT", col("date_time"), "%m월 %d일"), "date"],
        [fn("DATE_FORMAT", col("date_time"), "%Y-%m-%d %H:%i:%s"), "date_time"],
        [col("classHost.email"), "email"],
        "limit",
        "place",
        ["intro", "class_desc"],
      ],
      where: {
        limit: {
          [Op.gt]: sales,
        },
      },
      include: [
        {
          model: Class_food,
          as: "classFoods",
          attributes: ["name", "img"],
        },
        {
          model: Class_host,
          as: "classHost",
          attributes: ["img", "desc", "details"],
        },
      ],
    });

    if (!result) return "error: result";

    let date_time = result?.dataValues?.date_time;
    let time_required = result?.dataValues?.time_required;

    let start_time = moment(date_time).format("HH:mm");
    let end_time = moment(date_time)
      .add(time_required, "minutes")
      .format("HH:mm");

    let time_result = `${start_time} ~ ${end_time}`;

    result.dataValues.sales = sales;
    result.dataValues.isPurchased = isPurchased;
    result.dataValues.date_time = time_result;
    return { class: result };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getClassComments(id, targetId, limit = 3) {
  try {
    let customWhere = {
      class_id: id,
    };

    if (targetId) {
      customWhere.id = {
        [Op.lt]: targetId,
      };
    }

    let commnets = await Class_comment.findAndCountAll({
      where: customWhere,
      attributes: {
        exclude: ["user_id", "class_id", "deletedAt"],
        include: [
          [
            fn(
              "DATE_FORMAT",
              col("Class_comment.createdAt"),
              "%Y-%m-%d %H:%i:%s"
            ),
            "createdAt",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "writer",
          attributes: ["id", "nickname", "profile_img"],
        },
      ],
      limit: limit,
      order: [["id", "DESC"]],
    });

    if (!commnets) return "error: commnets";
    return commnets;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteComment(id) {
  try {
    let isDeleted = await Class_comment.destroy({ where: { id } });
    if (!isDeleted) return "error: isDeleted";
    return isDeleted;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function addComment(data) {
  try {
    let isCreated = await Class_comment.create(data);
    if (!isCreated) return "error: isCreated";

    return isCreated;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  getClassList,
  getClass,
  getClassComments,
  deleteComment,
  addComment,
};
