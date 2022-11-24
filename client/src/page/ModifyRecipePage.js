import React from "react";
import RegisterRecipePage from "./RegisterRecipePage";
import { my_recipe_data } from "../mockData/recipe_detail";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";

const myRecipeData = { ...my_recipe_data };

function ModifyRecipePage() {
  const { recipeId } = useParams();
  const { data, isLoading, isError } = useQuery(
    ["getMyRecipe", recipeId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}/modify`
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        return result?.recipe;
      }
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return <RegisterRecipePage modifyMode={true} myRecipeData={data} />;
}

export default ModifyRecipePage;
