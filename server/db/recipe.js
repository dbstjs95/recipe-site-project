const { Op, fn, col, literal } = require("sequelize");
const {
  User,
  Recipe,
  Recipe_step,
  Recipe_ingr,
  Recipe_ingr_detail,
  Recipe_comment,
  Like,
} = require("../models");

async function findRecipeById(id, user_id) {
  try {
    // 만약 user_id가 있으면 로그인 상태이므로 Like 테이블 조회하기
    let likeResult = await Like.findOne({ where: { user_id, recipe_id: id } });

    let isLiked = false;
    if (likeResult) {
      isLiked = true;
      //좋아요 기록 없다면 likeResult는 null임.
    }

    let recipeResult = await Recipe.findByPk(id, {
      attributes: [
        "id",
        ["header_title", "title"],
        ["header_img", "mainSrc"],
        ["header_desc", "intro"],
        "category",
        "servings",
        "time",
        "level",
        "view",
        ["likes", "like"],
        "createdAt",
      ],
      include: [
        {
          model: User,
          as: "writer",
          attributes: ["id", "nickname", "profile_img", "profile_desc"],
        },
        {
          model: Recipe_ingr,
          as: "ingredients",
          attributes: ["title"],
          include: [
            {
              model: Recipe_ingr_detail,
              as: "contents",
              attributes: ["name", "amount"],
            },
          ],
        },
        {
          model: Recipe_step,
          as: "steps",
          attributes: [["order", "step"], "text", "img"],
          order: "order",
        },
      ],
    });

    if (!recipeResult) return "error: recipeResult";

    // isLiked
    recipeResult.dataValues.isLiked = isLiked;

    // 카테고리
    let category = recipeResult.category;
    category = category.split(",");

    recipeResult.category = category;

    // details
    let details = [
      recipeResult.servings,
      recipeResult.time,
      recipeResult.level,
    ];

    recipeResult.dataValues.details = details;

    let deleteList = ["servings", "time", "level"];
    deleteList.map((item) => delete recipeResult.dataValues[item]);

    return recipeResult;
  } catch (err) {
    console.error("에러: ", err);
    return null;
  }
}

async function getRecipeComments(id, targetId, limit = 3) {
  // 처음: 해당 레시피 댓글 최신순으로 3개,
  // 로그인한 유저가 쓴 댓글이 가장 상단에
  try {
    let commnets;
    if (targetId) {
      commnets = await Recipe_comment.findAndCountAll({
        where: {
          recipe_id: id,
          id: {
            [Op.lt]: targetId,
          },
        },
        attributes: { exclude: ["user_id", "recipe_id"] },
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
    } else {
      commnets = await Recipe_comment.findAndCountAll({
        where: {
          recipe_id: id,
        },
        attributes: { exclude: ["user_id", "recipe_id"] },
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
    }

    if (!commnets) return "error: commnets";
    return commnets;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteComment(id) {
  try {
    let isDeleted = await Recipe_comment.destroy({ where: { id } });
    if (!isDeleted) return "error: isDeleted";
    return isDeleted;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function addComment(data) {
  try {
    let isCreated = await Recipe_comment.create(data);
    if (!isCreated) return "error: isCreated";

    console.log("isCreated: ", isCreated);
    return isCreated;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function createRecipe(type, data) {
  let {
    user_id,
    title,
    mainSrc,
    intro,
    category,
    recipeInfo,
    ingredients,
    steps,
  } = data;

  let str_category = category.join();

  let recipeData = {
    user_id,
    public: type === "public",
    category: str_category,
    header_img: mainSrc,
    header_title: title,
    header_desc: intro,
    servings: recipeInfo[0],
    time: recipeInfo[1],
    level: recipeInfo[2],
  };

  try {
    const result = await Recipe.create(recipeData);
    if (!result) return "error: recipe";

    let recipeId = result?.id;

    let ingr_titles = ingredients.map((item) => ({
      recipe_id: recipeId,
      title: item.name,
    }));

    let steps_data = steps.map((item, idx) => ({
      recipe_id: recipeId,
      order: idx + 1,
      text: item[0],
      img: item[1],
    }));

    const ingr_promise = Recipe_ingr.bulkCreate(ingr_titles);
    const steps_promise = Recipe_step.bulkCreate(steps_data);

    let results = await Promise.all([ingr_promise, steps_promise]);
    if (!results) return "error: ingr & steps";

    let ingr_results = results[0];
    let ingr_ids = ingr_results.map((item) => item.id);

    let ingr_detail_data = [];
    for (let i = 0; i < ingredients.length; i++) {
      let total = ingredients[i].contents.length;
      for (let j = 0; j < total; j++) {
        ingr_detail_data.push({
          recipe_ingr_id: ingr_ids[i],
          name: ingredients[i].contents[j][0],
          amount: ingredients[i].contents[j][1],
        });
      }
    }

    const ingr_detail_result = await Recipe_ingr_detail.bulkCreate(
      ingr_detail_data
    );
    if (!ingr_detail_result) return "error: ingr_detail";
    return "success";
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteRecipe(id) {
  try {
    let result = await Recipe.destroy({ where: { id } });
    // result 결과: 삭제된 수. 성공시 1, 해당하는 데이터가 없으면 0
    return result;
  } catch (err) {
    console.error(err);
    return "DB error";
  }
}

async function getRecipeList(
  list_type,
  order_by,
  category,
  keyword,
  offset,
  limit
) {
  try {
    let customOrder =
      order_by === "like" ? ["likes", "DESC"] : ["createdAt", "DESC"];

    let customLimit = list_type === "best" ? 10 : limit;

    let std;
    if (category) {
      let temp = category.split(",");
      std = temp.map((item, idx) => {
        if (item === "전체") {
          return "%";
        } else {
          if (idx === 2) return item;
          return `${item},`;
        }
      });
    } else {
      std = ["%"];
    }

    const STD = std.join("");

    if (keyword) {
      keyword = `%${keyword}%`;
    } else {
      keyword = "%";
    }

    let count;
    if ((list_type === "classification") & (offset === 0)) {
      count = await Recipe.count();
    }

    let data = await Recipe.findAll({
      where: {
        public: 1,
        category: {
          [Op.and]: {
            [Op.like]: STD,
          },
        },
        header_title: {
          [Op.like]: keyword,
        },
      },
      attributes: [
        ["id", "recipe_id"],
        ["likes", "like"],
        "view",
        ["header_img", "src"],
        ["header_title", "title"],
        ["createdAt", "created_at"],
      ],
      include: [
        {
          model: User,
          as: "writer",
          attributes: ["profile_img", "nickname"],
        },
      ],
      order: [customOrder],
      offset: offset,
      limit: customLimit,
    });

    if (!data) return "error: data";

    let result = data.map(({ dataValues: item }) => {
      let { profile_img, nickname } = item?.writer;
      let temp = [profile_img, nickname];
      delete item.writer;
      return { ...item, userInfo: temp };
    });

    if (!result) return "error: result";

    if (count) return { count, list: result };
    return { list: result };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  findRecipeById,
  getRecipeComments,
  deleteComment,
  addComment,
  createRecipe,
  deleteRecipe,
  getRecipeList,
};
