import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { colors } from "../css";

const Container = styled.div`
  width: 700px;
  /* height: 300px; */
  background-color: #fcfcfa;
  position: fixed;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border: 1px solid lightgray;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  span {
    font-size: 2rem;
    position: absolute;
    right: 15px;
    top: 5px;
    color: #555;
    cursor: pointer;
  }
  input {
    display: block;
    margin: 70px auto 20px;
    width: 90%;
    padding: 7px;
  }
  button {
    display: block;
    background-color: ${colors.main};
    border: 0;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 auto 30px;
    font-weight: bold;
    &:hover {
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.2);
    }
  }
`;

function UserInfoModal({ handleClick }) {
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <span onClick={() => handleClick(false)}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </span>
      <input
        type="text"
        placeholder="100자 이내로 작성해주세요."
        maxlength="100"
      />
      <button>저장</button>
    </Container>
  );
}

export default UserInfoModal;
