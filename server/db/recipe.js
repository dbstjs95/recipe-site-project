// const { Op, fn, col, literal } = require("sequelize");
// const {
//   User,
//   Recipe,
//   Recipe_step,
//   Recipe_ingr,
//   Recipe_ingr_detail,
//   Recipe_comment,
//   Like,
// } = require("../models");

// async function getRecipe(id, user_id = null) {
//   try {
//     // 만약 user_id가 있으면 로그인 상태이므로 Like 테이블 조회하기
//     let likeResult = await Like.findAll({ where: { recipe_id: id } });
//     let recipeLikes = likeResult.map((item) => item?.dataValues?.user_id);
//     let like = recipeLikes.length;

//     let isLiked = false;
//     if (user_id && like > 0)
//       isLiked = recipeLikes.some((item) => item === user_id);

//     // 조회수 올리기
//     let isVisited = await Recipe.increment({ view: 1 }, { where: { id } });
//     if (!isVisited) console.log("fail to update view");

//     let recipeResult = await Recipe.findOne({
//       where: { id: id, public: 1 },
//       attributes: [
//         "id",
//         ["header_title", "title"],
//         ["header_img", "mainSrc"],
//         ["header_desc", "intro"],
//         "category",
//         "servings",
//         "time",
//         "level",
//         "view",
//         "createdAt",
//       ],
//       include: [
//         {
//           model: User,
//           as: "writer",
//           attributes: ["id", "nickname", "profile_img", "profile_desc"],
//         },
//         {
//           model: Recipe_ingr,
//           as: "ingredients",
//           attributes: ["title"],
//           include: [
//             {
//               model: Recipe_ingr_detail,
//               as: "contents",
//               attributes: ["name", "amount"],
//             },
//           ],
//         },
//         {
//           model: Recipe_step,
//           as: "steps",
//           attributes: [["order", "step"], "text", "img"],
//           order: "order",
//         },
//       ],
//     });

//     if (!recipeResult) {
//       let data = await Recipe.findByPk(id);
//       if (!data) return "error: not exist";
//       return "error: private";
//     }

//     // like & isLiked
//     recipeResult.dataValues.like = like;
//     recipeResult.dataValues.isLiked = isLiked;

//     // 카테고리
//     let category = recipeResult.category;
//     category = category.split(",");

//     recipeResult.category = category;

//     // details
//     let details = [
//       recipeResult.servings,
//       recipeResult.time,
//       recipeResult.level,
//     ];

//     recipeResult.dataValues.details = details;

//     let deleteList = ["servings", "time", "level"];
//     deleteList.map((item) => delete recipeResult.dataValues[item]);

//     return recipeResult;
//   } catch (err) {
//     console.error("에러: ", err);
//     return null;
//   }
// }

// async function getRecipeComments(id, targetId, limit = 3) {
//   // 처음: 해당 레시피 댓글 최신순으로 3개,
//   try {
//     let customWhere = {
//       recipe_id: id,
//     };

//     if (targetId) {
//       customWhere.id = {
//         [Op.lt]: targetId,
//       };
//     }

//     let commnets = await Recipe_comment.findAndCountAll({
//       where: customWhere,
//       attributes: {
//         exclude: ["user_id", "recipe_id", "deletedAt"],
//         include: [
//           [
//             fn(
//               "DATE_FORMAT",
//               col("Recipe_comment.createdAt"),
//               "%Y-%m-%d %H:%i:%s"
//             ),
//             "createdAt",
//           ],
//         ],
//       },
//       include: [
//         {
//           model: User,
//           as: "writer",
//           attributes: ["id", "nickname", "profile_img"],
//         },
//       ],
//       limit: limit,
//       order: [["id", "DESC"]],
//     });

//     if (!commnets) return "error: commnets";
//     return commnets;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function deleteComment(id) {
//   try {
//     let isDeleted = await Recipe_comment.destroy({ where: { id } });
//     if (!isDeleted) return "error: isDeleted";
//     return isDeleted;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function addComment(data) {
//   try {
//     let isCreated = await Recipe_comment.create(data);
//     if (!isCreated) return "error: isCreated";

//     console.log("isCreated: ", isCreated);
//     return isCreated;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function createRecipe(userId, data) {
//   let { public, title, mainSrc, intro, category, details, ingredients, steps } =
//     data;

//   let str_category = category.join();

//   let recipeData = {
//     user_id: userId,
//     public,
//     category: str_category,
//     header_img: mainSrc,
//     header_title: title,
//     header_desc: intro,
//     servings: details[0],
//     time: details[1],
//     level: details[2],
//   };

//   try {
//     const result = await Recipe.create(recipeData);
//     if (!result) return "error: recipe";

//     let recipeId = result?.id;

//     let ingr_titles = ingredients.map((item) => ({
//       recipe_id: recipeId,
//       title: item.name,
//     }));

//     let steps_data = steps.map((item, idx) => ({
//       recipe_id: recipeId,
//       order: idx + 1,
//       text: item[0],
//       img: item[1],
//     }));

//     const ingr_promise = Recipe_ingr.bulkCreate(ingr_titles);
//     const steps_promise = Recipe_step.bulkCreate(steps_data);

//     let results = await Promise.all([ingr_promise, steps_promise]);
//     if (!results) return "error: ingr & steps";

//     let ingr_results = results[0];
//     let ingr_ids = ingr_results.map((item) => item.id);

//     let ingr_detail_data = [];
//     for (let i = 0; i < ingredients.length; i++) {
//       let total = ingredients[i].contents.length;
//       for (let j = 0; j < total; j++) {
//         ingr_detail_data.push({
//           recipe_ingr_id: ingr_ids[i],
//           name: ingredients[i].contents[j][0],
//           amount: ingredients[i].contents[j][1],
//         });
//       }
//     }

//     const ingr_detail_result = await Recipe_ingr_detail.bulkCreate(
//       ingr_detail_data
//     );
//     if (!ingr_detail_result) return "error: ingr_detail";
//     return "success";
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function deleteRecipe(id) {
//   try {
//     let result = await Recipe.destroy({ where: { id } });
//     // result 결과: 삭제된 수. 성공시 1, 해당하는 데이터가 없으면 0
//     return result;
//   } catch (err) {
//     console.error(err);
//     return "DB error";
//   }
// }

// async function getRecipeList(
//   list_type,
//   order_by,
//   category,
//   keyword,
//   offset,
//   limit
// ) {
//   try {
//     let customOrder =
//       order_by === "like"
//         ? [
//             ["like", "DESC"],
//             ["id", "ASC"],
//           ]
//         : [
//             ["createdAt", "DESC"],
//             ["id", "DESC"],
//           ];

//     let customLimit = list_type === "best" ? 10 : limit;

//     let std;
//     if (category) {
//       let temp = category.split(",");
//       std = temp.map((item, idx) => {
//         if (item === "전체") {
//           return "%";
//         } else {
//           if (idx === 2) return item;
//           return `${item},`;
//         }
//       });
//     } else {
//       std = ["%"];
//     }

//     const STD = std.join("");
//     console.log("STD: ", STD);

//     if (keyword) {
//       keyword = `%${keyword}%`;
//     } else {
//       keyword = "%";
//     }

//     let count;
//     if ((list_type === "classification") & (offset === 0)) {
//       count = await Recipe.count({
//         where: {
//           public: 1,
//           category: {
//             [Op.like]: STD,
//           },
//           header_title: {
//             [Op.like]: keyword,
//           },
//         },
//       });
//     }

//     let data = await Recipe.findAll({
//       where: {
//         public: 1,
//         category: {
//           // [Op.and]: {
//           //   [Op.like]: STD,
//           // },
//           [Op.like]: STD,
//         },
//         header_title: {
//           [Op.like]: keyword,
//         },
//       },
//       attributes: [
//         ["id", "recipe_id"],
//         "view",
//         ["header_img", "src"],
//         ["header_title", "title"],
//         [
//           fn("DATE_FORMAT", col("Recipe.createdAt"), "%Y-%m-%d %H:%i:%s"),
//           "created_at",
//         ],
//         [fn("COUNT", col("Likes.recipe_id")), "like"],
//       ],
//       include: [
//         {
//           model: Like,
//           attributes: [],
//         },
//         {
//           model: User,
//           as: "writer",
//           attributes: ["profile_img", "nickname"],
//         },
//       ],
//       order: customOrder,
//       group: "Recipe.id",
//       offset: offset,
//     });

//     if (!data) return "error: data";
//     if (data?.length === 0) return { count: 0, list: [] };

//     let limitedData = data?.slice(0, customLimit);
//     let result = limitedData.map(({ dataValues: item }) => {
//       let { profile_img, nickname } = item?.writer;
//       let temp = [profile_img, nickname];
//       delete item.writer;
//       return { ...item, userInfo: temp };
//     });

//     if (!result) return "error: result";

//     if (count) return { count, list: result };
//     return { list: result };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function getMyRecipe(id) {
//   try {
//     let recipeResult = await Recipe.findByPk(id, {
//       attributes: [
//         "id",
//         ["header_title", "title"],
//         ["header_img", "mainSrc"],
//         ["header_desc", "intro"],
//         "category",
//         "servings",
//         "time",
//         "level",
//       ],
//       include: [
//         {
//           model: Recipe_ingr,
//           as: "ingredients",
//           attributes: [["title", "name"]],
//           include: [
//             {
//               model: Recipe_ingr_detail,
//               as: "contents",
//               attributes: ["name", "amount"],
//             },
//           ],
//         },
//         {
//           model: Recipe_step,
//           as: "steps",
//           attributes: ["text", "img"],
//           order: "order",
//         },
//       ],
//     });

//     if (!recipeResult) return "error: recipeResult";

//     // 카테고리
//     let category = recipeResult.category;
//     category = category.split(",");

//     recipeResult.category = category;

//     // details
//     let details = [
//       recipeResult.servings,
//       recipeResult.time,
//       recipeResult.level,
//     ];

//     recipeResult.dataValues.details = details;

//     // ingredients
//     let ingredients = recipeResult?.ingredients?.map(({ dataValues: item }) => {
//       let { name, contents } = item;
//       let newContents = contents.map(({ dataValues: data }) => [
//         data?.name,
//         data?.amount,
//       ]);
//       return { name, contents: newContents };
//     });

//     recipeResult.dataValues.ingredients = ingredients;

//     // steps
//     let steps = recipeResult?.steps?.map(({ dataValues: item }) => [
//       item.text,
//       item.img,
//     ]);

//     recipeResult.dataValues.steps = steps;

//     let deleteList = ["servings", "time", "level"];
//     deleteList.map((item) => delete recipeResult.dataValues[item]);

//     return { recipe: recipeResult.dataValues };
//   } catch (err) {
//     console.error("에러: ", err);
//     return null;
//   }
// }

// async function updateRecipe(recipeId, data) {
//   let { public, title, mainSrc, intro, category, details, ingredients, steps } =
//     data;

//   let str_category = category.join();

//   let recipeData = {
//     public,
//     category: str_category,
//     header_img: mainSrc,
//     header_title: title,
//     header_desc: intro,
//     servings: details[0],
//     time: details[1],
//     level: details[2],
//   };

//   try {
//     const recipe = await Recipe.update(recipeData, { where: { id: recipeId } });

//     if (!recipe) return "error: recipe";

//     // step, ingr, ingr_detail 삭제후 다시 생성
//     let deleteResult = await Promise.all([
//       Recipe_step.destroy({ where: { recipe_id: recipeId } }),
//       Recipe_ingr.destroy({ where: { recipe_id: recipeId } }),
//     ]);

//     if (!deleteResult) return "error: deleteResult";

//     let ingr_titles = ingredients.map((item) => ({
//       recipe_id: recipeId,
//       title: item.name,
//     }));

//     let steps_data = steps.map((item, idx) => ({
//       recipe_id: recipeId,
//       order: idx + 1,
//       text: item[0],
//       img: item[1],
//     }));

//     const ingr_promise = Recipe_ingr.bulkCreate(ingr_titles);
//     const steps_promise = Recipe_step.bulkCreate(steps_data);

//     let results = await Promise.all([ingr_promise, steps_promise]);
//     if (!results) return "error: ingr & steps";

//     let ingr_results = results[0];
//     let ingr_ids = ingr_results.map((item) => item.id);

//     let ingr_detail_data = [];
//     for (let i = 0; i < ingredients.length; i++) {
//       let total = ingredients[i].contents.length;
//       for (let j = 0; j < total; j++) {
//         ingr_detail_data.push({
//           recipe_ingr_id: ingr_ids[i],
//           name: ingredients[i].contents[j][0],
//           amount: ingredients[i].contents[j][1],
//         });
//       }
//     }

//     const ingr_detail_result = await Recipe_ingr_detail.bulkCreate(
//       ingr_detail_data
//     );
//     if (!ingr_detail_result) return "error: ingr_detail";
//     return { message: "success" };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// module.exports = {
//   getRecipe,
//   getRecipeComments,
//   deleteComment,
//   addComment,
//   createRecipe,
//   deleteRecipe,
//   getRecipeList,
//   getMyRecipe,
//   updateRecipe,
// };
