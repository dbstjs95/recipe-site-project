import React from "react";
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
      img.food {
        width: 230px;
        height: 230px;
        border-radius: 5px 5px 0 0;
        object-fit: cover;
      }
      p.title {
        width: 100%;
        padding-top: 8px;
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
        padding-top: 8px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span {
          margin-left: 5px;
        }
      }
      p.view {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        font-size: 13px;
        color: #a8a8a8;
        padding-right: 5px;
      }
    }
  }
`;

function BestRecipeBox({ children }) {
  return (
    <BestSection>
      {children}
      <ul>
        {recipeList.map((item, idx) => {
          const { order, src, title, userInfo, view } = item;
          let simpleView = (Number(view) / 10000).toFixed(1);
          return (
            <li key={idx}>
              <span className="order">{order}</span>
              <img src={src} className="food" />
              <p className="title">{title}</p>
              <p className="user">
                <img src={userInfo[0]} />
                <span>{userInfo[1]}</span>
              </p>
              <p className="view">조회수 {simpleView}만</p>
            </li>
          );
        })}
      </ul>
    </BestSection>
  );
}

export default BestRecipeBox;
