import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const {
    data: recipeData,
    isLoading,
    isError,
  } = useQuery(
    ["getRecipe", recipeId],
    async () => {
      let result = await axios
        .get(`${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}`)
        .then((res) => res.data);
      console.log("result: ", result);
      if (result?.message === "success") return result?.recipe;
      return null;
    },
    {
      onError: ({ response }) => {
        let {
          data: { recipe },
        } = response;
        if (recipe === "error: not exist") {
          alert("존재하지 않는 게시물입니다.");
        } else if (recipe === "error: private") {
          alert("비공개중인 게시물입니다.");
        }
        navigate(-1);
      },
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>error...</div>;

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
