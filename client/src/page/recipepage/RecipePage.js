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
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSetAuth } from "../../contexts/AuthContext";

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

function RecipePage({ setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const navigate = useNavigate();
  const { recipeId } = useParams();

  const user = queryClient.getQueryData("login");

  const {
    data: recipeData,
    isLoading,
    isError,
  } = useQuery(
    ["getRecipe", recipeId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);

      if (user && result?.authInfo) {
        let { isAuth, newToken } = result?.authInfo;
        if (!isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
        } else if (isAuth && newToken) {
          queryClient.setQueryData("login", (prev) => ({
            ...prev,
            token: newToken,
          }));
        }
      }

      if (result?.status === 200) return result?.recipe;
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
        <RecipeDetailIntro
          data={recipeData}
          setHeader={setHeader}
          user={user}
          ID={recipeId}
        />
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
        <RecipeDetailComments
          ID={recipeId}
          use="recipe"
          user={user}
          setHeader={setHeader}
        />
      </div>
    </Container>
  );
}

export default RecipePage;
