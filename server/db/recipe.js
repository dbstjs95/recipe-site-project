const { Recipe } = require("../models");
const { Recipe_step } = require("../models");
const { Recipe_ingr } = require("../models");
const { Recipe_ingr_detail } = require("../models");

async function findRecipeById(id) {
  try {
    let result = await Recipe.findOne({
      where: { id },
    });

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function CreateRecipe(type, data) {
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
    // console.log("result: ", result);

    let recipeId = result?.id;
    if (!recipeId) return null;

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

    const ingr_promise = await Recipe_ingr.bulkCreate(ingr_titles);
    const steps_promise = await Recipe_step.bulkCreate(steps_data);

    let results = await Promise.all([ingr_promise, steps_promise]);
    if (!results) return null;

    let ingr_results = results[0];
    let ingr_IDs = ingr_results.map((item) => item.id);

    let ingr_detail_data = [];
    for (let i = 0; i < ingredients.length; i++) {
      let total = ingredients[i].contents.length;
      for (let j = 0; j < total; j++) {
        ingr_detail_data.push({
          recipe_ingr_id: ingr_IDs[i],
          name: ingredients[i].contents[j][0],
          amount: ingredients[i].contents[j][1],
        });
      }
    }

    const ingr_detail_result = await Recipe_ingr_detail.bulkCreate(
      ingr_detail_data
    );
    if (!ingr_detail_result) return null;
    return "success";
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { findRecipeById, CreateRecipe };
