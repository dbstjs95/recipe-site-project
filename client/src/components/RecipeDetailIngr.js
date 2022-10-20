import React from "react";
import styled from "styled-components";

const Container = styled.div`
  > h2 {
    font-size: 22px;
    font-weight: bold;
    padding: 15px 10px;
    margin-left: 10px;
  }
  > ul {
    width: 90%;
    margin: 0 auto 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const ListContainer = styled.li`
  /* border: 1px solid orange; */
  width: 45%;
  padding: 10px 20px;
  margin-bottom: 10px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #454443;
  }

  ${({ isOdd }) =>
    isOdd &&
    `
    &:last-of-type {
      width: 100%;
      ul{
        max-height: 200px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: space-between;
        li{
          width: 45%;
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
        {data.ingredients.map((list, idx) => {
          return (
            <ListContainer key={idx} isOdd={isOdd}>
              <h3>[{list[0]}]</h3>
              <ItemContainer>
                {list.map((item, idx) => {
                  if (idx === 0) return;
                  return (
                    <li key={idx}>
                      <span className="key">{item[0]}</span>
                      <span className="value">{item[1]}</span>
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
