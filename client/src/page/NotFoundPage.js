import React from "react";
import styled from "styled-components";
import error from "../assets/error.png";

const Container = styled.div`
  width: 1000px;
  height: 75vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Nanum Gothic", sans-serif;
  img {
    width: 40%;
    @media screen and (max-width: 1200px) {
      width: 35%;
    }
    @media screen and (max-width: 1000px) {
      width: 40%;
    }
  }
  p {
    font-size: 18px;
    font-weight: bold;
    color: crimson;
    margin-top: 30px;
  }
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    p {
      font-size: 16px;
      margin-top: 20px;
    }
  }
  @media screen and (max-width: 400px) {
    p {
      font-size: 14px;
      margin-top: 15px;
    }
  }
`;

function NotFoundPage() {
  return (
    <Container>
      <img src={error} alt="NotFound 페이지" />
      <p>찾을 수 없는 페이지입니다.</p>
    </Container>
  );
}

export default NotFoundPage;
