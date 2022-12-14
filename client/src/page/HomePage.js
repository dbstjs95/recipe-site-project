import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EventBox from "../components/EventBox";
import ClassifyBox from "../components/ClassifyBox";
import RecipeListBox from "../components/RecipeListBox";
import ClassesBox from "../components/ClassesBox";
import { LayoutSize } from "../css";
import recipeList from "../mockData/recipe_list";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSetAuth } from "../contexts/AuthContext";

const ENV = process.env;

//헤더 디자인~
const HeaderStyle = styled.h1`
  font-weight: bold;
  font-size: 22px;
  color: #5e5d5c;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: inset 0 0 5px lightgray;
  @media screen and (max-width: 768px) {
    text-align: center;
    font-size: 23px;
  }
`;
const ClassifyHeader = styled(HeaderStyle)``;
const BestHeader = styled(HeaderStyle)`
  padding: 10px;
  position: relative;
  a {
    position: absolute;
    top: 50%;
    right: 1%;
    transform: translateY(-50%);
    background-color: white;
    border: 1px solid lightgray;
    padding: 2px 7px;
    color: #4f4f4d;
    font-size: 15px;
    font-weight: normal;
  }
`;
const ClassesBoxHeader = styled(BestHeader)``;
//~헤더 디자인

const Container = styled.div`
  ${LayoutSize}
  margin: 0 auto;
  padding: 10px 0;
  > section {
    &:not(:last-of-type) {
      margin-bottom: 30px;
    }
    background-color: white;
    box-shadow: 0 0 3px rgb(0 0 1/50%);
    border-radius: 5px;
  }
`;

function HomePage({ setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const user = queryClient.getQueryData("login");

  const {
    data: rcpData,
    isLoading,
    isError,
  } = useQuery(
    ["recipeList", "best"],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe?list_type=best`,
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

      if (result?.status === 200) {
        return result?.list;
      }
      return null;
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Container>
      <EventBox />
      <ClassifyBox>
        <ClassifyHeader>레시피 분류</ClassifyHeader>
      </ClassifyBox>
      <RecipeListBox data={rcpData} use="best">
        <BestHeader>
          베스트 레시피
          <Link to="/recipes?type=best">더보기</Link>
        </BestHeader>
      </RecipeListBox>
      <ClassesBox setHeader={setHeader}>
        <ClassesBoxHeader>
          요리 클래스
          <Link to="/classes">더보기</Link>
        </ClassesBoxHeader>
      </ClassesBox>
    </Container>
  );
}

export default HomePage;
