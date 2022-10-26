import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
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

const OrderImgBox = styled.div`
  ${({ imgSrc }) =>
    imgSrc
      ? css`
          background: url(${imgSrc}) no-repeat center center;
          background-size: cover;
        `
      : css`
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.07);
        `}
  border: 1px solid gainsboro;
  width: 170px;
  height: 170px;
  span {
    ${({ imgSrc }) =>
      imgSrc &&
      css`
        display: none;
      `}
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
      textarea {
        background-color: rgba(0, 0, 0, 0.07);
        border: 1px solid gainsboro;
        flex: 1;
        margin-right: 3px;
        resize: none;
        padding: 10px;
      }
      .order_img span {
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
        .order_img {
          width: 150px;
          height: 150px;
          span {
            font-size: 2rem;
          }
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
        .order_img {
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
      padding: 10px 0 20px;
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

function OrderInputBox({ modifyMode, InputData, setInputData }) {
  const orderImgRef = useRef(null);

  //register: 주어진 초기 데이터로 만들면 됨.(문제없음)
  //modify: 1) steps: [["sdsd", "sdsds"], ...] (문제없음)
  //        2) steps: [] (안에 내용물이 없음...) (문제있음)
  //        3) steps: undefined인 경우 (문제있음)

  let { steps = [["", ""]] } = InputData;
  steps = steps.length === 0 ? [["", ""]] : steps;

  let temp = Array(modifyMode ? steps.length : 1)
    .fill(0)
    .map((_) => uuid());

  const [ItemArrState, setItemArrState] = useState([...temp]);
  const [StepsData, setStepsData] = useState([...steps]);

  const handleSelectFile = () => {
    orderImgRef.current.click();
  };

  const handlePlusBtn = (targetIdx) => {
    setItemArrState((prev) => {
      let newArr = [...prev];
      newArr.splice(targetIdx + 1, 0, uuid());
      return newArr;
    });
    setStepsData((prev) => {
      let newState = [...prev];
      newState.splice(targetIdx + 1, 0, ["", ""]);
      return newState;
    });
  };

  //1개면 삭제 X
  const handleDeleteBtn = (targetId, index) => {
    if (ItemArrState.length <= 1) return;

    setItemArrState((prev) => {
      let newArr = prev.filter((id) => id !== targetId);
      return newArr;
    });
    setStepsData((prev) => {
      let newState = [...prev];
      newState.splice(index, 1);
      return newState;
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
                <textarea defaultValue={StepsData[idx][0]} />
                <OrderImgBox
                  className="order_img"
                  onClick={handleSelectFile}
                  imgSrc={StepsData[idx][1]}
                >
                  <span>
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                </OrderImgBox>
                <input
                  ref={orderImgRef}
                  type="file"
                  style={{ display: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <p>
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  onClick={() => handlePlusBtn(idx)}
                />
                <FontAwesomeIcon
                  icon={faSquareXmark}
                  onClick={() => handleDeleteBtn(id, idx)}
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
