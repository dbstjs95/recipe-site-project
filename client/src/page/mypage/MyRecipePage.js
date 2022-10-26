import React, { useState } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import recipeList from "../../mockData/recipe_list";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

const myRecipeData = [...recipeList].slice(0, 5);

const barColor = "lightgray";

export const Container = styled.div`
  div#pagination {
    text-align: center;
    padding: 10px 0 30px;
  }
`;

const Bar = styled.ul`
  display: flex;
  li {
    &:nth-child(${({ order }) => order[0]}) {
      border-top: 1px solid ${barColor};
      border-left: 1px solid ${barColor};
      border-right: 1px solid ${barColor};
      font-weight: bold;
    }
    &:nth-child(${({ order }) => order[1]}) {
      border-bottom: 1px solid ${barColor};
    }
    a {
      display: block;
      padding: 15px 20px;
      font-size: 18px;
      cursor: pointer;
      @media screen and (max-width: 500px) {
        font-size: 17px;
        padding: 12px 15px;
      }
      @media screen and (max-width: 400px) {
        font-size: 15px;
        padding: 10px 13px;
      }
      &:hover {
        color: black;
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
      }
    }
  }
  > div {
    flex: 1;
    border-bottom: 1px solid ${barColor};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    span {
      padding: 5px;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      &:nth-child(2) {
        margin: 0 18px;
      }
      em {
        display: none;
      }
      &.active {
        em {
          display: block;
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          left: -7px;
          color: green;
          opacity: 0.8;
        }
      }
    }
    @media screen and (max-width: 500px) {
      padding-right: 15px;
      span {
        font-size: 13px;
        &:nth-child(2) {
          margin: 0 10px;
        }
      }
    }
    @media screen and (max-width: 400px) {
      padding-right: 8px;
      span {
        font-size: 12px;
        &:nth-child(2) {
          margin: 0 8px;
        }
      }
    }
    @media screen and (max-width: 350px) {
      padding-right: 5px;
      span {
        padding: 3px;
        &:nth-child(2) {
          margin: 0px;
        }
        &.active {
          font-weight: bold;
          em {
            display: none;
          }
        }
      }
    }
  }
`;

export const ContentPrivate = styled.ul`
  padding: 20px;
  li {
    display: flex;
    border-bottom: 1px solid lightgray;
    padding: 15px;
    margin-bottom: 10px;
    img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      margin-right: 30px;
      border-radius: 5px;
      @media screen and (max-width: 500px) {
        width: 135px;
        height: 135px;
        margin-right: 20px;
      }
    }
    @media screen and (max-width: 400px) {
      padding: 10px;
      img {
        width: 120px;
        height: 120px;
        margin-right: 10px;
      }
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        display: block;
        font-size: 18px;
        font-weight: bold;
        word-break: break-all;
        color: #5d5f61;
        margin-bottom: 15px;
        @media screen and (max-width: 600px) {
          font-size: 17px;
        }
        @media screen and (max-width: 500px) {
          font-size: 16px;
        }
        @media screen and (max-width: 400px) {
          font-size: 15px;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const ContentPublic = styled(ContentPrivate)`
  li > div p.detail {
    display: flex;
    flex-direction: column;
    span {
      font-size: 14px;
      @media screen and (max-width: 500px) {
        font-size: 13px;
      }
      @media screen and (max-width: 400px) {
        font-size: 12px;
      }
    }
  }
`;

function MyRecipePage() {
  const [Selected, setSelected] = useState(0);
  const [Public, setPublic] = useState(true);
  const [IsOpen, setIsOpen] = useState(false);

  const handleOrderSelect = (num) => setSelected((prev) => num);

  const LocaleStringfn = (num) => Number(num).toLocaleString();

  return (
    <Container>
      <Bar order={Public ? [1, 2] : [2, 1]}>
        <li onClick={() => setPublic(true)}>
          <a>공개중</a>
        </li>
        <li onClick={() => setPublic(false)}>
          <a>작성중</a>
        </li>
        <div>
          {["최신순", "조회순", "인기순"].map((item, idx) => (
            <span
              key={idx}
              className={Selected === idx ? "active" : ""}
              onClick={() => handleOrderSelect(idx)}
            >
              {item}
              <em>
                <FontAwesomeIcon icon={faCheck} />
              </em>
            </span>
          ))}
        </div>
      </Bar>
      {Public ? (
        <ContentPublic>
          {myRecipeData.map((item, idx) => {
            return (
              <li key={idx}>
                <img src={item.src} />
                <div>
                  <Link>
                    <h2>{item.title}</h2>
                  </Link>
                  <p className="detail">
                    <span>조회수 {LocaleStringfn(item.view)}</span>
                    <span>좋아요 {LocaleStringfn(item.like)}</span>
                    <span></span>
                  </p>
                </div>
              </li>
            );
          })}
        </ContentPublic>
      ) : (
        <ContentPrivate>
          {myRecipeData.map((item, idx) => {
            return (
              <li key={idx}>
                <img src={item.src} />
                <div>
                  <Link to="/modify/1">
                    <h2>{item.title}</h2>
                  </Link>
                </div>
              </li>
            );
          })}
        </ContentPrivate>
      )}
      <div id="pagination">
        <Pagination totalData={5} dataLimit={5} />
      </div>
    </Container>
  );
}

export default MyRecipePage;
