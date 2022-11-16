import React from "react";
import styled from "styled-components";
import { H2Style } from "./RecipeDetailIngr";
import { colors } from "../css";
import { bucketUrl } from "../api/fileUpload";

const Container = styled.ul`
  width: 80%;
  margin: 0 auto;
  padding: 20px 15px;
  @media screen and (max-width: 1220px) {
    width: 90%;
  }
  @media screen and (max-width: 960px) {
    width: 97%;
  }
  h2 {
    ${H2Style};
    padding: 5px 0;
  }
  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    > div.desc {
      width: 65%;
      display: flex;
      align-items: flex-start;
      padding-right: 20px;
      span {
        background-color: ${colors.main};
        padding: 1px 10px;
        border-radius: 50%;
        font-weight: bold;
        color: #fff;
        margin-right: 15px;
      }
      p {
        /* word-break: break-all; */
        white-space: pre-line;
      }
      span,
      p {
        font-size: 1.2em;
      }
      @media screen and (max-width: 960px) {
        span {
          padding: 1px 10px;
        }
        span,
        p {
          font-size: 1.1em;
        }
      }
      @media screen and (max-width: 600px) {
        span {
          padding: 0px 8px;
          margin-right: 10px;
        }
        span,
        p {
          font-size: 1em;
        }
      }
    }
    @media screen and (max-width: 500px) {
      flex-direction: column;
      > div.desc {
        width: 100%;
        padding-right: 10px;
        p {
          word-break: break-all;
        }
      }
    }
  }
`;

const StepsImg = styled.div`
  background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
  background-size: cover;
  width: 35%;
  height: 0;
  padding-bottom: 23%;
  border-radius: 15px;
  @media screen and (max-width: 500px) {
    width: 60%;
    padding-bottom: 40%;
    align-self: center;
    margin: 15px 0;
  }
`;

const ResultImg = styled.div`
  width: 60%;
  height: 0;
  padding-bottom: 40%;
  margin: 50px auto;
  background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
  background-size: cover;
  border-radius: 15px;
  outline: 10px double rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.3);
  @media screen and (max-width: 500px) {
    width: 80%;
    padding-bottom: 60%;
  }
`;

function RecipeDetailSteps({ data }) {
  return (
    <Container>
      <h2>조리순서</h2>
      {data?.steps.map((item) => {
        return (
          <li key={item?.step}>
            <div className="desc">
              <span>{item?.step}</span>
              <p>{item?.text}</p>
            </div>
            <StepsImg
              className="img"
              imgSrc={`${bucketUrl}${item?.img}`}
            ></StepsImg>
          </li>
        );
      })}
      {data?.resultSrc ? (
        <ResultImg imgSrc={`${bucketUrl}${data?.resultSrc}`}></ResultImg>
      ) : (
        <ResultImg imgSrc={`${bucketUrl}${data?.mainSrc}`}></ResultImg>
      )}
    </Container>
  );
}

export default RecipeDetailSteps;
