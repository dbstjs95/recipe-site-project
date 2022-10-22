import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { recipe_info } from "../../mockData/recipe_detail";
import { LayoutSize, ContainerStyle } from "../../css";
import RecipeDetailIntro from "../../components/RecipeDetailIntro";
import RecipeDetailIngr from "../../components/RecipeDetailIngr";
import RecipeDetailSteps from "../../components/RecipeDetailSteps";
import RecipeDetailWriter from "../../components/RecipeDetailWriter";
import RecipeDetailComments from "../../components/RecipeDetailComments";

const Container = styled.div`
  > div {
    ${LayoutSize}
    ${ContainerStyle}
    margin-bottom: 25px;
  }
`;

function RecipePage() {
  const { recipeId } = useParams();
  return (
    <Container>
      <div className="intro">
        <RecipeDetailIntro data={recipe_info} />
      </div>
      <div className="ingredients">
        <RecipeDetailIngr data={recipe_info} />
      </div>
      <div className="steps">
        <RecipeDetailSteps data={recipe_info} />
      </div>
      <div className="writerInfo">
        <RecipeDetailWriter data={recipe_info.userInfo} />
      </div>
      <div className="comments">
        <RecipeDetailComments data={recipe_info.commentsData} />
      </div>
    </Container>
  );
}

export default RecipePage;
