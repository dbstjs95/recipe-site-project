import React from "react";
import RegisterRecipePage from "./RegisterRecipePage";
import { my_recipe_data } from "../mockData/recipe_detail";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSetAuth } from "../contexts/AuthContext";

const myRecipeData = { ...my_recipe_data };

function ModifyRecipePage({ setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const navigate = useNavigate();

  const { recipeId } = useParams();
  const user = queryClient.getQueryData("login");

  const { data, isLoading, isError } = useQuery(
    ["getMyRecipe", recipeId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}/modify`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);

      if (user && result?.authInfo) {
        let { isAuth, newToken } = result?.authInfo;
        if (!isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          return navigate("/user/login");
        } else if (isAuth && newToken) {
          queryClient.setQueryData("login", (prev) => ({
            ...prev,
            token: newToken,
          }));
        }
      }

      if (result?.status === 200) {
        return result?.recipe;
      }
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <RegisterRecipePage
      setHeader={setHeader}
      modifyMode={true}
      myRecipeData={data}
    />
  );
}

export default ModifyRecipePage;
