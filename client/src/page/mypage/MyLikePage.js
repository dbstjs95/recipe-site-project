import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Link, useOutletContext } from "react-router-dom";
import { Container as EntireBox, ContentPublic } from "../mypage/MyRecipePage";
import recipeList from "../../mockData/recipe_list";
import Pagination from "../../components/Pagination";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { bucketUrl } from "../../api/fileUpload";
import userStaticImg from "../../assets/logo_img/user.png";
import { useSetAuth } from "../../contexts/AuthContext";

const myLikeData = [...recipeList].slice(0, 5);

export const HeaderStyle = css`
  padding: 20px 0 0 20px;
  > div {
    display: inline-block;
    font-size: 22px;
    font-weight: bold;
    .underline {
      height: 8px;
      position: relative;
      bottom: 11px;
      background-color: #ff592b;
      opacity: 0.5;
    }
    @media screen and (max-width: 800px) {
      font-size: 21px;
    }
    @media screen and (max-width: 500px) {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 400px) {
    padding: 20px 0 0;
    text-align: center;
    p {
      font-size: 18px;
    }
  }
  @media screen and (max-width: 300px) {
    p {
      font-size: 17px;
    }
  }
`;

const Container = styled(EntireBox)`
  h1 {
    ${HeaderStyle};
  }
`;
const ListContainer = styled(ContentPublic)``;
const WriterInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  figure {
    background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
    width: 35px;
    height: 35px;
    background-size: cover;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
    margin-right: 10px;
  }
  span {
    font-size: 14px;
    color: #8a068a;
  }
  @media screen and (max-width: 500px) {
    figure {
      width: 20px;
      height: 20px;
    }
    span {
      font-size: 12px;
    }
  }
  @media screen and (max-width: 400px) {
    margin-top: -5px;
    figure {
      margin-right: 7px;
    }
  }
  @media screen and (max-width: 300px) {
    display: none;
  }
`;

function MyLikePage() {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const { setHeader, user } = useOutletContext();

  const LIMIT = 10;
  const [Count, setCount] = useState(0);
  const [PagingInfo, setPagingInfo] = useState({
    // order_by: "created_at",
    offset: 0,
    limit: LIMIT,
  });

  const { data, isLoading, isError } = useQuery(
    ["myLikeList", PagingInfo],
    async ({ queryKey }) => {
      let { offset, limit } = queryKey[1];
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/user/likes?offset=${offset}&limit=${limit}`,
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
        if (offset === 0) setCount(result?.count);
        return result?.list;
      }
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const LocaleStringfn = (num) => Number(num).toLocaleString();

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Container>
      <h1>
        <div>
          레시피 좋아요 목록
          <div className="underline"></div>
        </div>
      </h1>
      <ListContainer>
        {myLikeData.map((item, idx) => {
          let profile_img = item?.userInfo[0];
          let writerImg = profile_img ? bucketUrl + profile_img : userStaticImg;
          return (
            <li key={idx}>
              <img src={item?.src} />
              <div>
                <Link to={`/recipes/${item?.recipe_id}`}>
                  <h2>{item?.title}</h2>
                </Link>
                <WriterInfo imgSrc={writerImg}>
                  <figure></figure>
                  <span>{item?.userInfo[1]}</span>
                </WriterInfo>
                <p className="detail">
                  <span>조회수 {LocaleStringfn(item?.view)}</span>
                  <span>좋아요 {LocaleStringfn(item?.like)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ListContainer>
      <div id="pagination">
        <Pagination
          totalData={Count}
          dataLimit={LIMIT}
          setPagingInfo={setPagingInfo}
        />
      </div>
    </Container>
  );
}

export default MyLikePage;
