const { Op, fn, col, literal } = require("sequelize");
const {
  User,
  Class,
  Class_food,
  Class_party,
  Class_comment,
} = require("../models");

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
        [fn("COUNT", col("Class.id")), "sales"],
      ],
      include: [
        {
          model: Class_party,
          attributes: [],
        },
      ],
      group: ["Class.id"],
      // order: [[마감일 급한 순으로]],
      offset: offset,
      limit: limit,
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { getClassList };
