import React from "react";
import styled, { css } from "styled-components";

export const H2Style = css`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  @media screen and (max-width: 600px) {
    font-size: 20px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px 15px;
  @media screen and (max-width: 960px) {
    width: 90%;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    padding: 20px 15px 10px;
  }
  > h2 {
    ${H2Style};
  }
  > ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const ListContainer = styled.li`
  width: 45%;
  margin-bottom: 20px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #454443;
  }

  @media screen and (max-width: 600px) {
    width: 47%;
    h3 {
      font-size: 16px;
    }
    li {
      font-size: 15px;
    }
  }

  @media screen and (max-width: 480px) {
    h3 {
      font-size: 15px;
    }
    li {
      font-size: 13px;
    }
  }

  ${({ isOdd, little }) =>
    isOdd &&
    `
    &:last-of-type {
      width: 100%;
      ul{
        display: flex;
        flex-direction: ${little ? "column" : "row"};
        flex-wrap: wrap;
        justify-content: space-between;
        li{
          width: 45%;
          @media screen and (max-width: 600px) {
            width: 47%;
          }
        }
      }
    }
  `};
`;

const ItemContainer = styled.ul`
  li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    padding: 5px;
    span {
      &.key {
      }
      &.value {
        color: #949392;
      }
    }
  }
`;

function RecipeDetailIngr({ data }) {
  const isOdd = !(data?.ingredients?.length % 2 === 0);

  return (
    <Container>
      <h2>재료</h2>
      <ul>
        {data?.ingredients.map((obj, idx) => {
          let little = obj?.contents?.length <= 5;
          return (
            <ListContainer key={idx} isOdd={isOdd} little={little}>
              <h3>[{obj?.title || "재료"}]</h3>
              <ItemContainer>
                {obj?.contents.map((item, idx) => {
                  // if (idx === 0) return;
                  return (
                    <li key={idx}>
                      <span className="key">{item?.name}</span>
                      <span className="value">{item?.amount}</span>
                    </li>
                  );
                })}
              </ItemContainer>
            </ListContainer>
          );
        })}
      </ul>
    </Container>
  );
}

export default RecipeDetailIngr;
