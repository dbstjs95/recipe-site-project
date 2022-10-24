import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Container as EntireBox, ContentPublic } from "../mypage/MyRecipePage";
import recipeList from "../../mockData/recipe_list";
import Pagination from "../../components/Pagination";

const myLikeData = [...recipeList].slice(0, 5);

const Container = styled(EntireBox)``;
const ListContainer = styled(ContentPublic)``;
const WriterInfo = styled.p`
  display: flex;
  align-items: center;
  margin: 10px 0;
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
`;

function MyLikePage() {
  const LocaleStringfn = (num) => Number(num).toLocaleString();

  return (
    <Container>
      <ListContainer>
        {myLikeData.map((item, idx) => {
          return (
            <li key={idx}>
              <img src={item.src} />
              <div>
                <Link>
                  <h1>{item.title}</h1>
                </Link>
                <WriterInfo imgSrc={item.userInfo[0]}>
                  <figure></figure>
                  <span>{item.userInfo[1]}</span>
                </WriterInfo>
                <p className="detail">
                  <span>조회수 {LocaleStringfn(item.view)}</span>
                  <span>좋아요 {LocaleStringfn(item.like)}</span>
                  <span></span>
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
