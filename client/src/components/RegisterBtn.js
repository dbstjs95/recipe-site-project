import React from "react";
import styled from "styled-components";
import { colors } from "../css";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  padding: 30px 0;
  button {
    padding: 10px 20px;
    font-size: 20px;
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    &.save {
      background-color: ${colors.main};
    }
    &.release {
      background-color: #a3314a;
    }
    &.cancel {
      border: 1px solid gray;
      color: #555;
      background-color: #fff;
    }
    @media screen and (max-width: 700px) {
      font-size: 18px;
    }
  }
  @media screen and (max-width: 900px) {
    width: 70%;
  }
  @media screen and (max-width: 600px) {
    width: 80%;
  }
  @media screen and (max-width: 480px) {
    width: 90%;
    button {
      font-size: 16px;
      padding: 7px 15px;
    }
  }
  @media screen and (max-width: 350px) {
    width: 95%;
  }
`;

function RegisterBtn() {
  return (
    <Container>
      <button className="save">저장</button>
      <button className="release">저장 후 공개하기</button>
      <button className="cancel">취소</button>
    </Container>
  );
}

export default RegisterBtn;
