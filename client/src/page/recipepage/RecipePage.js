import React from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { recipe_info } from "../../mockData/recipe_detail";
import { LayoutSize, ContainerStyle } from "../../css";
import RecipeDetailIntro from "../../components/RecipeDetailIntro";
import RecipeDetailIngr from "../../components/RecipeDetailIngr";
import RecipeDetailSteps from "../../components/RecipeDetailSteps";
import RecipeDetailWriter from "../../components/RecipeDetailWriter";
import RecipeDetailComments from "../../components/RecipeDetailComments";
import { useQuery } from "react-query";
import axios from "axios";

export const DetailPageLayout = css`
  ${LayoutSize}
  ${ContainerStyle}
    margin-bottom: 25px;
`;

export const Container = styled.div`
  > div {
    ${DetailPageLayout};
  }
`;

function RecipePage() {
  // const { recipeId } = useParams();

  // 테스트용
  let recipeId = 4;

  const { data: recipeData, isLoading } = useQuery(
    "getRecipe",
    async () => {
      let result = await axios
        .get(`${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}`)
        .then((res) => res.data);
      if (result?.message === "success") return result?.recipe;
      return null;
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <div className="intro">
        <RecipeDetailIntro data={recipeData} />
      </div>
      <div className="ingredients">
        <RecipeDetailIngr data={recipeData} />
      </div>
      <div className="steps">
        <RecipeDetailSteps data={recipeData} />
      </div>
      <div className="writerInfo">
        <RecipeDetailWriter data={recipeData?.writer} />
      </div>
      <div className="comments">
        <RecipeDetailComments ID={recipeData?.id} use="recipe" />
      </div>
    </Container>
  );
}

export default RecipePage;
