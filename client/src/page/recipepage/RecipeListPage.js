import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CategoryBox from "../../components/CategoryBox";
import { LayoutSize, ContainerStyle } from "../../css";
import RecipeListBox from "../../components/RecipeListBox";
import Pagination from "../../components/Pagination";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSetAuth } from "../../contexts/AuthContext";
import { Nodata, Loading, Fetching, Error } from "../../components/States";

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

function RecipeListPage({ setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const { search } = useLocation();
  const user = queryClient.getQueryData("login");

  const LIMIT = 15;

  const [InitialCategory, setInitialCategory] = useState({
    type: "전체",
    circumstance: "전체",
    ingredient: "전체",
  });

  const [Count, setCount] = useState(0);
  const [IsOpen, setIsOpen] = useState(true);

  const [PagingInfo, setPagingInfo] = useState({
    order_by: "like",
    offset: 0,
    limit: LIMIT,
    keyword: "",
    category: "",
  });

  const handleSortClick = (order) =>
    setPagingInfo((prev) => ({ ...prev, order_by: order, offset: 0 }));

  const { data, isLoading, isError, isFetching } = useQuery(
    ["recipeList", PagingInfo],
    async ({ queryKey }) => {
      let { order_by, offset, limit, keyword, category } = queryKey[1];

      let isExisted = queryClient.getQueryData(queryKey);
      if (isExisted) {
        if (offset === 0) setCount(isExisted?.count);
        return isExisted;
      }

      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/recipe?list_type=classification&order_by=${order_by}&keyword=${keyword}&category=${category}&offset=${offset}&limit=${limit}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data)
        .catch((err) => err?.response?.data);

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
        if (offset === 0) setCount(result?.count);
        return result;
      } else {
        alert(result?.message || "에러가 발생했습니다.");
        throw new Error("에러 발생");
      }
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  // 홈화면에 있는 [카테고리란, 검색창, 베스트 더보기]로 들어올 때만 유효함
  useEffect(() => {
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
      offset: 0,
    }));
  }, [search]);

  if (isLoading) return <Loading height="75vh" type="dots" />;
  if (isError) return <Error />;

  return (
    <>
      {isFetching && <Fetching size="90" />}
      <Container>
        <div className="category">
          <CategoryBox
            state={IsOpen}
            InitialCategory={InitialCategory}
            setPagingInfo={setPagingInfo}
          />
        </div>
        <div className="recipe_list">
          {Count > 0 ? (
            <>
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
                <RecipeListBox data={data?.list} use="list" />
              </ul>
              <div id="pagination">
                <Pagination
                  totalData={Count}
                  dataLimit={LIMIT}
                  setPagingInfo={setPagingInfo}
                  PagingInfo={PagingInfo}
                />
              </div>
            </>
          ) : (
            <Nodata
              height="50vh"
              imgSize={{ w: "200px", h: "200px" }}
              text="해당하는 레시피가 없습니다."
              interval="20px"
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default RecipeListPage;
