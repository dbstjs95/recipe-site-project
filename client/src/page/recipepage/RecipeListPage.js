import React, { useState } from "react";
import styled from "styled-components";
import CategoryBox from "../../components/CategoryBox";
import { LayoutSize } from "../../css";
import recipeList from "../../mockData/recipe_list";
import RecipeListBox from "../../components/RecipeListBox";
import Pagination from "../../components/Pagination";

const Container = styled.div`
  ${LayoutSize}
  margin: 0 auto;
  background-color: white;
  padding: 10px 0 30px;
  > div {
    &.category {
      width: 100%;
      margin: 0 auto 30px;
    }
    &.recipe_list {
      /* border-top: 1px solid lightgray; */
      margin: 0 auto;
      ul.sort {
        display: flex;
        justify-content: flex-end;
        padding: 5px 40px 0 0;
        li {
          border: 1px solid lightgray;
          padding: 5px 10px;
          cursor: pointer;
          &.like {
            border-left: 0;
          }
          &:hover,
          &.selected {
            box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
          }
        }
      }
      ul#recipe_list {
      }
      div#pagination {
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
`;

function RecipeListPage() {
  const [Selected, setSelected] = useState("추천순");

  const handleSortClick = (order) => setSelected(order);

  return (
    <Container>
      <div className="category">
        <CategoryBox />
      </div>
      <div className="recipe_list">
        <ul className="sort">
          <li
            className={`newest ${Selected === "최신순" && "selected"}`}
            onClick={() => handleSortClick("최신순")}
          >
            최신순
          </li>
          <li
            className={`like ${Selected === "추천순" && "selected"}`}
            onClick={() => handleSortClick("추천순")}
          >
            추천순
          </li>
        </ul>
        <ul id="recipe_list">
          <RecipeListBox data={recipeList} use="list" />
        </ul>
        <div id="pagination">
          <Pagination totalPage={523} />
        </div>
      </div>
    </Container>
  );
}

export default RecipeListPage;
