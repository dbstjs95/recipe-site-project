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
      p.detail {
        display: flex;
        width: 100%;
        /* justify-content: space-between; */
        justify-content: flex-end;
        padding: 15px 5px 5px;
        span {
          font-size: 13px;
          color: #a8a8a8;
          &.like {
            em {
              color: #fc3d4d;
            }
          }
        }
      }
      /* p.detail_list {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      } */
    }
  }
`;

const DetailStyle = styled.p`
  display: flex;
  width: 100%;
  justify-content: ${({ best }) => (best ? `flex-end` : `space-between`)};
  padding: ${({ best }) => (best ? `0 5px 5px 0` : `12px 5px 3px`)};
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

function BestRecipeBox({ children, data = recipeList, use }) {
  return (
    <BestSection>
      {children}
      <ul>
        {data.map((item, idx) => {
          const { order, src, title, userInfo, view, like } = item;
          let simpleView = (Number(view) / 10000).toFixed(1);
          return (
            <li key={idx}>
              {use === "best" && <span className="order">{order}</span>}
              <img src={src} className="food" />
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

export default BestRecipeBox;
