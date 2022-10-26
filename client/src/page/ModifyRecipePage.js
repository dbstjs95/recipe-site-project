import React from "react";
import RegisterRecipePage from "./RegisterRecipePage";
import { my_recipe_data } from "../mockData/recipe_detail";

const myRecipeData = { ...my_recipe_data };

function ModifyRecipePage() {
  return <RegisterRecipePage modifyMode={true} myRecipeData={myRecipeData} />;
}

export default ModifyRecipePage;
