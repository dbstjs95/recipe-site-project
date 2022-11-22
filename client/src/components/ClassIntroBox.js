import React from "react";
import styled, { css } from "styled-components";

const H2Style = styled.h2`
  display: inline-block;
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
  .under_line {
    background-color: #b8c91e;
    width: 100%;
    height: 8px;
    position: relative;
    bottom: 10px;
    opacity: 0.5;
  }
  @media screen and (max-width: 900px) {
    font-size: 1.4em;
  }
  @media screen and (max-width: 700px) {
    font-size: 1.3em;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.2em;
  }
`;

function Title({ children }) {
  return (
    <H2Style>
      {children}
      <div className="under_line"></div>
    </H2Style>
  );
}

//메인
const MainContainer = styled.div`
  pre {
    white-space: pre-line;
    word-break: break-all;
    font-size: 1.2em;
    @media screen and (max-width: 900px) {
      font-size: 1.1em;
    }
    @media screen and (max-width: 700px) {
      font-size: 1em;
    }
    @media screen and (max-width: 480px) {
      font-size: 0.9em;
    }
  }
`;

export function ClassMainIntro({ data }) {
  return (
    <MainContainer>
      <Title>클래스 소개</Title>
      <pre>{data}</pre>
    </MainContainer>
  );
}

//음식 사진
const FoodImgContainer = styled.div`
  margin-bottom: 30px;
  width: 100%;
  h3 {
    font-size: 1.1em;
    font-weight: bold;
    color: #7d5a27;
    padding: 10px 0;
    @media screen and (max-width: 700px) {
      font-size: 1em;
    }
    @media screen and (max-width: 500px) {
      font-size: 0.9em;
    }
  }
  .img {
    background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
    background-size: cover;
    width: 100%;
    height: 0;
    padding-bottom: 60%;
    border-radius: 10px;
  }
`;

export function ClassSubIntro({ data }) {
  return (
    <div>
      <Title>이런 음식을 만들 수 있어요!</Title>
      {data.map((item, idx) => {
        let { title, img } = item;
        return (
          <FoodImgContainer imgSrc={img} key={idx}>
            <h3>{title}</h3>
            <div className="img"></div>
          </FoodImgContainer>
        );
      })}
    </div>
  );
}

//호스트
const HostContainer = styled.div`
  > div {
    .img {
      background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
      background-size: cover;
      width: 100%;
      height: 0;
      padding-bottom: 60%;
      border-radius: 10px;
      margin: 20px 0;
    }
    pre {
      white-space: pre-line;
      &.text {
        margin: 25px 0 35px;
        font-size: 1.2em;
      }
      &.profile {
        line-height: 1.2em;
        border-radius: 10px;
        color: rgba(0, 0, 0, 0.5);
      }
      @media screen and (max-width: 900px) {
        &.text {
          font-size: 1.1em;
        }
        &.profile {
          font-size: 15px;
        }
      }
      @media screen and (max-width: 700px) {
        &.text {
          font-size: 1em;
        }
        &.profile {
          font-size: 13px;
        }
      }
      @media screen and (max-width: 480px) {
        &.text {
          font-size: 0.9em;
        }
        &.profile {
          font-size: 12px;
        }
      }
    }
  }
`;

export function HostIntro({ data }) {
  const { photo, text, profile } = data;
  return (
    <HostContainer imgSrc={photo}>
      <Title>호스트 소개</Title>
      <div>
        <div className="img"></div>
        <pre className="text">{text}</pre>
        <pre className="profile">{profile}</pre>
      </div>
    </HostContainer>
  );
}
