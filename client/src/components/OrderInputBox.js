import React, { useState } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSquarePlus,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { colors } from "../css";

const Container = styled.div`
  padding: 5px 0 15px;
  h2 {
    font-size: 22px;
    color: #5e5e5e;
    font-weight: bold;
    padding: 8px 13px;
    @media screen and (max-width: 1024px) {
      font-size: 20px;
    }
    @media screen and (max-width: 700px) {
      font-size: 19px;
    }
    @media screen and (max-width: 480px) {
      font-size: 18px;
    }
  }
`;
const InputContainer = styled.ul`
  li {
    display: flex;
    justify-content: center;
    width: 80%;
    margin: 0 auto;
    padding: 17px 0px;
    position: relative;
    h3 {
      font-size: 28px;
      margin-right: 10px;
      color: ${colors.main};
      font-weight: bold;
      width: 10%;
      flex-shrink: 0;
    }
    > div {
      display: flex;
      width: 90%;
      textarea,
      label {
        background-color: rgba(0, 0, 0, 0.07);
        border: 1px solid gainsboro;
      }
      textarea {
        flex: 1;
        margin-right: 3px;
        resize: none;
        padding: 10px;
      }
      label {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 170px;
        height: 170px;
        font-size: 3rem;
        color: gray;
      }
    }
    p {
      display: flex;
      flex-direction: column;
      position: absolute;
      transform: translate(100%, -50%);
      top: 50%;
      right: 0;
      font-size: 2rem;
      color: rgba(7, 122, 65, 0.8);
      cursor: pointer;
    }
    @media screen and (max-width: 1220px) {
      width: 90%;
      h3 {
        font-size: 26px;
      }
    }
    @media screen and (max-width: 768px) {
      width: 90%;
      margin: 0 auto 0 20px;
      h3 {
        font-size: 24px;
        width: 13%;
      }
      > div {
        label {
          width: 150px;
          height: 150px;
          font-size: 2rem;
        }
      }
      p {
        font-size: 1.6rem;
      }
    }
    @media screen and (max-width: 480px) {
      > div {
        flex-direction: column;
        align-items: center;
        min-height: 350px;
        padding-top: 5px;
        textarea {
          width: 80%;
          margin-right: 0;
          margin-bottom: 15px;
        }
        label {
          width: 170px;
          height: 170px;
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    padding-bottom: 15px;
    li {
      flex-direction: column;
      width: 90%;
      margin: 0 auto;
      padding: 10px 0 0;
      h3 {
        width: 100%;
        margin: 0 0 7px;
      }
      > div {
        width: 100%;
      }
      p {
        flex-direction: row;
        transform: translate(0, 0);
        top: 10px;
        right: 10px;
      }
    }
  }
`;

function OrderInputBox() {
  const [ItemArrState, setItemArrState] = useState([uuid()]);

  const handleSelectFile = (e) => {
    e.preventDefault();
  };

  const handlePlusBtn = (targetIdx) =>
    setItemArrState((prev) => {
      let newArr = [...prev];
      newArr.splice(targetIdx + 1, 0, uuid());
      return newArr;
    });

  const handleDeleteBtn = (targetId) => {
    if (ItemArrState.length <= 1) return;
    setItemArrState((prev) => {
      let newArr = prev.filter((id) => id !== targetId);
      return newArr;
    });
  };

  return (
    <Container>
      <h2>요리순서 작성하기</h2>
      <InputContainer>
        {ItemArrState.map((id, idx) => {
          return (
            <li key={id}>
              <h3>{`Step${idx + 1}`}</h3>
              <div>
                <textarea />
                <label htmlFor="img_file" onClick={handleSelectFile}>
                  <FontAwesomeIcon icon={faPlus} />
                </label>
                <input id="img_file" type="file" style={{ display: "none" }} />
              </div>
              <p>
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  onClick={() => handlePlusBtn(idx)}
                />
                <FontAwesomeIcon
                  icon={faSquareXmark}
                  onClick={() => handleDeleteBtn(id)}
                />
              </p>
            </li>
          );
        })}
      </InputContainer>
    </Container>
  );
}

export default OrderInputBox;
