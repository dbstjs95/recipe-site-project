import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import recipeList from "../mockData/recipe_list";

const BestSection = styled.section`
  ul {
    width: 95%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, auto));
    justify-items: center;
    grid-column-gap: 5px;
    li {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 230px;
      padding: 0 5px 5px 5px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      margin-bottom: 2rem;
      cursor: pointer;
      span.order {
        position: absolute;
        top: -3px;
        left: -3px;
        background-color: white;
        font-size: 1.3rem;
        width: 2em;
        height: 2em;
        text-align: center;
        line-height: 2em;
        border: 1px solid #cfcfcf;
        border-radius: 5px;
      }
      p.title {
        width: 100%;
        padding-top: 5px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        /* white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; */
      }
      p.user {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        color: #787775;
        padding: 7px 0 5px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span {
          margin-left: 5px;
        }
      }
    }
  }
`;

const ImgBox = styled.div`
  width: 230px;
  height: 200px;
  background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
  background-size: 100%;
  border-radius: 5px 5px 0 0;
  transition: background-size 0.5s;
  &:hover {
    background-size: 110%;
  }
`;

const DetailStyle = styled.p`
  display: flex;
  width: 100%;
  justify-content: ${({ best }) => (best ? `flex-end` : `space-between`)};
  padding: 0 5px 3px 0;
  span {
    font-size: 13px;
    color: #a8a8a8;
    &.like {
      display: ${({ best }) => best && `none`};
      em {
        color: #f05663;
      }
    }
  }
`;

function RecipeListBox({ children, data = recipeList, use }) {
  const navigate = useNavigate();
  const handleMovePage = () => navigate("/recipes/4");

  return (
    <BestSection>
      {children}
      <ul>
        {data.map((item, idx) => {
          const { order, src, title, userInfo, view, like } = item;
          let simpleView = (Number(view) / 10000).toFixed(1);
          return (
            <li key={idx} onClick={handleMovePage}>
              {use === "best" && <span className="order">{order}</span>}
              <ImgBox imgSrc={src} />
              <p className="title">{title}</p>
              <p className="user">
                <img src={userInfo[0]} />
                <span>{userInfo[1]}</span>
              </p>
              <DetailStyle best={use === "best"}>
                <span className="like">
                  <em>&hearts;</em> {like}
                </span>
                <span className="view">조회수 {simpleView}만</span>
              </DetailStyle>
            </li>
          );
        })}
      </ul>
    </BestSection>
  );
}

export default RecipeListBox;
