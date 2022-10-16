import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EventBox from "../components/EventBox";
import ClassifyBox from "../components/ClassifyBox";
import RecipeListBox from "../components/RecipeListBox";
import ClassesBox from "../components/ClassesBox";
import { LayoutSize } from "../css";
import recipeList from "../mockData/recipe_list";

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
  padding: 30px 0 10px 0;
  > section {
    margin-bottom: 30px;
    background-color: white;
    box-shadow: 0 0 3px rgb(0 0 1/50%);
    border-radius: 5px;
  }
`;

function HomePage() {
  return (
    <Container>
      <EventBox />
      <ClassifyBox>
        <ClassifyHeader>레시피 분류</ClassifyHeader>
      </ClassifyBox>
      <RecipeListBox data={recipeList} use="best">
        <BestHeader>
          베스트 레시피
          <Link to="/recipes">더보기</Link>
        </BestHeader>
      </RecipeListBox>
      <ClassesBox>
        <ClassesBoxHeader>
          요리 클래스
          <Link to="/classes">더보기</Link>
        </ClassesBoxHeader>
      </ClassesBox>
    </Container>
  );
}

export default HomePage;
