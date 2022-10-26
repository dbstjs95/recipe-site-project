import React from "react";
import styled from "styled-components";
import { colors } from "../css";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 700px;
  margin: 0 auto;
  padding: 30px 10px;
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
    &.cancel,
    &.delete {
      border: 1px solid gray;
      color: #555;
      background-color: #fff;
    }
    &.delete {
    }
  }
  @media screen and (max-width: 850px) {
    width: 100%;
  }
  @media screen and (max-width: 700px) {
    button {
      padding: 8px 15px;
      font-size: 18px;
    }
  }
  @media screen and (max-width: 500px) {
    padding: 30px 6px;
    button {
      padding: 7px 10px;
      font-size: 16px;
    }
  }
  @media screen and (max-width: 400px) {
    button {
      padding: 7px 10px;
      font-size: 14px;
    }
  }
`;

function RegisterBtn({ modifyMode }) {
  return (
    <Container>
      <button className="save">저장</button>
      <button className="release">저장 후 공개하기</button>
      <button className="cancel">취소</button>
      {modifyMode && <button className="delete">삭제</button>}
    </Container>
  );
}

export default RegisterBtn;
