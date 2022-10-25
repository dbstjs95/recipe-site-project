import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { Container as EntireBox, ContentPublic } from "../mypage/MyRecipePage";
import recipeList from "../../mockData/recipe_list";
import Pagination from "../../components/Pagination";

const myLikeData = [...recipeList].slice(0, 5);

export const HeaderStyle = css`
  padding: 20px 0 0 20px;
  > p {
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
const WriterInfo = styled.p`
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
  const LocaleStringfn = (num) => Number(num).toLocaleString();

  return (
    <Container>
      <h1>
        <p>
          레시피 좋아요 목록
          <div className="underline"></div>
        </p>
      </h1>
      <ListContainer>
        {myLikeData.map((item, idx) => {
          return (
            <li key={idx}>
              <img src={item.src} />
              <div>
                <Link>
                  <h2>{item.title}</h2>
                </Link>
                <WriterInfo imgSrc={item.userInfo[0]}>
                  <figure></figure>
                  <span>{item.userInfo[1]}</span>
                </WriterInfo>
                <p className="detail">
                  <span>조회수 {LocaleStringfn(item.view)}</span>
                  <span>좋아요 {LocaleStringfn(item.like)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ListContainer>
      <div id="pagination">
        <Pagination totalData={5} dataLimit={5} />
      </div>
    </Container>
  );
}

export default MyLikePage;
