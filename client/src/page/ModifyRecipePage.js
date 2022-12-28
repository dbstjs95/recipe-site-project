import React from "react";
import RegisterRecipePage from "./RegisterRecipePage";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSetAuth } from "../contexts/AuthContext";
import { Error, Loading } from "../components/States";

function ModifyRecipePage({ setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const navigate = useNavigate();

  const recipeId = Number(useParams()?.recipeId);
  const user = queryClient.getQueryData("login");

  const { data, isFetching, isError } = useQuery(
    ["getMyRecipe", recipeId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipeId}/modify`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data)
        .catch((err) => {
          console.error(err);
          return err?.response?.data;
        });

      if (result?.authInfo) {
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
      } else {
        throw new Error("에러 발생");
      }
    },
    { refetchOnWindowFocus: false }
  );

  if (isFetching) return <Loading height="75vh" type="dots" />;
  if (isError) return <Error />;

  return (
    <RegisterRecipePage
      setHeader={setHeader}
      modifyMode={true}
      myRecipeData={data}
    />
  );
}

export default ModifyRecipePage;
