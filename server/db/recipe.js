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
          attributes: [["title", "name"]],
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
          attributes: ["order", "text", "img"],
          order: "order",
        },
      ],
    });

    if (!recipeResult) return "error: recipeResult";

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

    // let stepsPromise = Recipe_step.findAll({
    //   where: { recipe_id: id },
    // });

    // let ingrPromise = Recipe_ingr.findAll({
    //   where: { recipe_id: id },
    // });

    // let results = await Promise.all([recipePromise, stepsPromise, ingrPromise]);
    // // results 결과: [{ recipe }, [recipeSteps {}, {}, ...], [recipeIngr {}, {}]]

    // let userId;
    // let ingr_ids;
    // if (results) {
    //   userId = results[0].user_id;
    //   ingr_ids = results[2].map((item) => item.id);
    // } else {
    //   return "error: recipe & steps & ingr";
    // }

    // let writerInfo, ingrDetails;
    // if (userId && ingr_ids) {
    //   let writerPromise = User.findOne({
    //     where: { id: 1 },
    //     attributes: ["id", "nickname", "profile_img", "profile_desc"],
    //   });

    //   let ingrDetailPromise = Recipe_ingr_detail.findAll({
    //     where: {
    //       recipe_ingr_id: {
    //         [Op.in]: ingr_ids,
    //       },
    //     },
    //   });

    //   let subResults = await Promise.all([writerPromise, ingrDetailPromise]);
    //   if (!subResults || subResults.length === 0) return "error: subResults";

    //   writerInfo = subResults[0];
    //   ingrDetails = subResults[1];
    // } else {
    //   return "error: userId && ingr_ids";
    // }

    // let recipeData;
    // if (ingrDetails && writerInfo) {
    //   let recipe = { ...results[0].dataValues };
    //   let steps = [...results[1]];
    //   let ingr = [...results[2]];

    //   let category = recipe?.category && recipe.category.split(",");
    //   let stepsList = steps.map((item) => [item.text, item.img]);
    //   let ingrList = ingr.map((item) => {
    //     let contents = ingrDetails
    //       .filter((data) => data.recipe_ingr_id === item.id)
    //       .map((data) => [data.name, data.amount]);
    //     return { name: item.title, contents };
    //   });

    //   recipeData = {
    //     writer: writerInfo,
    //     title: recipe.header_title,
    //     mainSrc: recipe.header_img,
    //     intro: recipe.header_desc,
    //     category,
    //     details: [recipe.servings, recipe.time, recipe.level],
    //     ingredients: ingrList,
    //     steps: stepsList,
    //     view: recipe.view,
    //     like: recipe.likes,
    //     // 로그인 한 상태라면 like 테이블을 통해 isLiked 알아내기
    //     isLiked,
    //     resultSrc: recipe.header_img,
    //   };
    // } else {
    //   return "error: writerInfo & ingrDetail";
    // }

    // if (!recipeData) return "error: recipeInfo";

    // return recipeData;
  } catch (err) {
    console.error("에러: ", err);
    return null;
  }
}

async function getRecipeComments(id, user_id) {
  // 처음: 해당 레시피 댓글 최신순으로 3개,
  // 로그인한 유저가 쓴 댓글이 가장 상단에
  try {
    let commnets;
    if (user_id) {
      commnets = await Recipe_comment.findAndCountAll({
        where: { recipe_id: id },
        attributes: { exclude: ["recipe_id"] },
        limit: 3,
        order: [
          [fn("field", col("user_id"), user_id), "DESC"],
          ["createdAt", "DESC"],
        ],
      });
    } else {
      commnets = await Recipe_comment.findAndCountAll({
        where: { recipe_id: id },
        attributes: { exclude: ["recipe_id"] },
        limit: 3,
        order: [["createdAt", "DESC"]],
      });
    }

    return commnets;
  } catch (err) {
    console.error(err);
    return "server error";
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

module.exports = {
  findRecipeById,
  getRecipeComments,
  createRecipe,
  deleteRecipe,
};
