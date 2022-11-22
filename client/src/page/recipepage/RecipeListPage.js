import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CategoryBox from "../../components/CategoryBox";
import { LayoutSize, ContainerStyle } from "../../css";
import recipeList from "../../mockData/recipe_list";
import RecipeListBox from "../../components/RecipeListBox";
import Pagination from "../../components/Pagination";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

const Container = styled.div`
  ${LayoutSize}
  ${ContainerStyle}
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
  const { search } = useLocation();

  const LIMIT = 15;

  const [InitialCategory, setInitialCategory] = useState({
    type: "전체",
    circumstance: "전체",
    ingredient: "전체",
  });

  const [Count, setCount] = useState(20);
  const [IsOpen, setIsOpen] = useState(true);

  const [PagingInfo, setPagingInfo] = useState({
    order_by: "like",
    offset: 0,
    limit: LIMIT,
    keyword: "",
    category: "",
  });

  const handleSortClick = (order) =>
    setPagingInfo((prev) => ({ ...prev, order_by: order }));

  const {
    data: listData,
    isLoading,
    isError,
  } = useQuery(
    ["recipeList", PagingInfo],
    async ({ queryKey }) => {
      let { order_by, offset, limit, keyword, category } = queryKey[1];
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe?list_type=classification&order_by=${order_by}&keyword=${keyword}&category=${category}&offset=${offset}&limit=${limit}`
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        if (offset === 0) setCount(result?.count);
        return result?.list;
      }
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  useState(() => {
    if (!search) return;
    let type = new URLSearchParams(search).get("type");

    // type=search
    let keyword = new URLSearchParams(search).get("keyword");

    // type=category
    let category;
    if (type === "category") {
      let sort = new URLSearchParams(search).get("sort");
      let value = new URLSearchParams(search).get("value");

      setInitialCategory((prev) => ({ ...prev, [sort]: value }));

      let sortList = ["type", "circumstance", "ingredient"];
      let temp = sortList.map((item) => (item === sort ? value : "전체"));
      category = temp.join(",");
    }

    if (type === "best" || type === "search") setIsOpen(false);

    setPagingInfo((prev) => ({
      ...prev,
      keyword: keyword || "",
      category: category || "전체,전체,전체",
    }));
  }, [search]);

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Container>
      <div className="category">
        <CategoryBox
          state={IsOpen}
          InitialCategory={InitialCategory}
          setPagingInfo={setPagingInfo}
        />
      </div>
      <div className="recipe_list">
        <ul className="sort">
          <li
            className={`newest ${
              PagingInfo?.order_by === "created_at" ? "selected" : ""
            }`}
            onClick={() => handleSortClick("created_at")}
          >
            최신순
          </li>
          <li
            className={`like ${
              PagingInfo?.order_by === "like" ? "selected" : ""
            }`}
            onClick={() => handleSortClick("like")}
          >
            추천순
          </li>
        </ul>
        <ul id="recipe_list">
          {/* <RecipeListBox data={recipeList} use="list" /> */}
          <RecipeListBox data={listData} use="list" />
        </ul>
        <div id="pagination">
          <Pagination
            totalData={Count}
            dataLimit={LIMIT}
            setPagingInfo={setPagingInfo}
          />
        </div>
      </div>
    </Container>
  );
}

export default RecipeListPage;
