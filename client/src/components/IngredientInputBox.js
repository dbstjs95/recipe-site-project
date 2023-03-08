import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faSquareMinus,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import uuid from "react-uuid";

const Container = styled.ul`
  li {
    display: flex;
    margin-bottom: 60px;
    > div.title {
      display: flex;
      flex-direction: column;
      width: 30%;
      align-items: center;
      &:hover {
        span {
          display: block;
        }
      }
      input,
      span {
        width: 75%;
        @media screen and (max-width: 960px) {
          width: 90%;
        }
      }
      input {
        height: 43px;
        padding: 0 10px;
        font-size: 18px;
        font-weight: bold;
        background-color: rgba(201, 145, 14, 0.1);
        @media screen and (max-width: 600px) {
          font-size: 16px;
          height: 40px;
        }
      }
      span {
        display: none;
        font-size: 15px;
        text-align: right;
        margin-top: 8px;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        em {
          color: rgba(199, 2, 8, 0.9);
        }
        @media screen and (max-width: 600px) {
          font-size: 14px;
        }
      }
    }
    @media screen and (max-width: 480px) {
      flex-direction: column;
      align-items: center;
      > div.title {
        flex-direction: row;
        width: 80%;
        margin-bottom: 18px;
        span {
          display: block;
          font-size: 13px;
          width: 30%;
        }
      }
    }
    @media screen and (max-width: 380px) {
      > div.title {
        width: 85%;
        span {
          font-size: 11px;
        }
      }
    }
  }
  input {
    border: 1px solid #b8b8b8;
  }
`;

const InnerContainer = styled.ul`
  position: relative;
  width: 70%;
  li {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    > p {
      position: relative;
      width: 80%;
      display: flex;
      justify-content: center;
    }
    input {
      width: 45%;
      height: 40px;
      padding: 0 10px;
      background-color: rgba(119, 184, 79, 0.1);
      &:first-child {
        margin-right: 10px;
        width: 55%;
      }
      @media screen and (max-width: 600px) {
        font-size: 15px;
        height: 37px;
      }
    }
    span.delete {
      display: none;
      position: absolute;
      right: -25px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      @media screen and (max-width: 480px) {
        right: -18px;
        font-size: 14px;
      }
      @media screen and (max-width: 380px) {
        right: -14px;
        font-size: 12px;
      }
    }
    &:hover {
      span.delete {
        display: block;
      }
    }
    @media screen and (max-width: 600px) {
      justify-content: flex-start;
      padding-left: 15px;
      > p {
        width: 90%;
      }
    }
  }
  @media screen and (max-width: 480px) {
    width: 100%;
    li {
      justify-content: center;
      padding-left: 0px;
    }
  }
`;

const PlusButton = styled.span`
  position: absolute;
  transform: translateX(-50%);
  bottom: -35px;
  left: 50%;
  cursor: pointer;
  font-size: 18px;
  color: rgba(12, 117, 40, 0.8);
  font-weight: bold;
  @media screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

function IngredientInnerBox({
  handleDeleteList,
  isFirst,
  data,
  setData,
  itemOrder,
}) {
  const example = [
    ["예) 돼지고기", "예) 300g"],
    ["예) 양배추", "예) 1/2개"],
    ["예) 참기름", "예) 1T"],
    ["예) 소금", "예) 2t"],
    ["예) 고추가루 약간", "예)"],
  ];

  let initialState = [
    ["", ""],
    ["", ""],
    ["", ""],
  ];

  const { name: ingrName = "", contents: ingrContents = initialState } = data;

  let numForCreate = isFirst ? 3 : 2;
  let temp = Array(
    ingrContents.length >= numForCreate ? ingrContents.length : numForCreate
  )
    .fill(0)
    .map((_) => uuid());

  const [ItemArrState, setItemArrState] = useState([...temp]);

  const handleChangeValue = (e, key, index, order) => {
    let newData;
    if (key === "name") {
      newData = { ...data, [key]: e.target.value };
    } else {
      let newContents = [...ingrContents];

      if (!newContents[index]) {
        newContents[index] = ["", ""];
      }
      newContents[index][order] = e.target.value;
      newData = { ...data, [key]: newContents };
    }

    setData((prev) => {
      let newList = [...prev.ingredients];
      newList[itemOrder] = newData;
      return { ...prev, ingredients: newList };
    });
  };

  const handlePlusItem = () => {
    setItemArrState((prev) => [...prev, uuid()]);
    setData((prev) => {
      let newContents = [...ingrContents, ["", ""]];
      let newData = { ...data, contents: newContents };
      let newList = [...prev.ingredients];
      newList[itemOrder] = newData;

      return { ...prev, ingredients: newList };
    });
  };

  const handleDeleteItem = (index) => {
    setItemArrState((prev) => {
      let newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });

    setData((prev) => {
      let newContents = [...ingrContents];
      newContents.splice(index, 1);
      let newData = { ...data, contents: newContents };
      let newList = [...prev.ingredients];
      newList[itemOrder] = newData;

      return { ...prev, ingredients: newList };
    });
  };

  return (
    <>
      <div className="title">
        <input
          type="text"
          placeholder="재료"
          defaultValue={ingrName}
          onChange={(e) => handleChangeValue(e, "name")}
        />
        <span onClick={handleDeleteList}>
          재료단위{" "}
          <em>
            <FontAwesomeIcon icon={faMinusSquare} />
          </em>
        </span>
      </div>
      <InnerContainer>
        {ItemArrState.map((id, idx) => (
          <li key={id}>
            <p>
              <input
                type="text"
                placeholder={example[idx % 5][0]}
                defaultValue={ingrContents[idx] && ingrContents[idx][0]}
                onChange={(e) => handleChangeValue(e, "contents", idx, 0)}
              />
              <input
                type="text"
                placeholder={example[idx % 5][1]}
                defaultValue={ingrContents[idx] && ingrContents[idx][1]}
                onChange={(e) => handleChangeValue(e, "contents", idx, 1)}
              />
              <span className="delete" onClick={() => handleDeleteItem(idx)}>
                <FontAwesomeIcon icon={faSquareMinus} />
              </span>
            </p>
          </li>
        ))}
        <PlusButton onClick={handlePlusItem}>
          <FontAwesomeIcon icon={faSquarePlus} /> 추가
        </PlusButton>
      </InnerContainer>
    </>
  );
}

const SubContainer = styled.div`
  border-top: 1px solid lightgray;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > p {
    &.desc {
      margin-bottom: 20px;
      color: crimson;
      font-size: 13px;
      @media screen and (max-width: 480px) {
        display: none;
      }
    }
    &.btn {
      border: 1px solid lightgray;
      font-size: 18px;
      padding: 5px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #4f5250;
      cursor: pointer;
      span {
        font-size: 25px;
        margin-right: 10px;
      }
      @media screen and (max-width: 600px) {
        font-size: 15px;
        span {
          font-size: 20px;
          margin-right: 7px;
        }
      }
    }
  }
`;

function IngredientInputBox({ modifyMode, InputData, setInputData }) {
  let initialState = [
    {
      name: "",
      contents: [
        ["", ""],
        ["", ""],
        ["", ""],
      ],
    },
  ];

  const { ingredients: ingrData = initialState } = InputData;

  let temp = Array(modifyMode ? ingrData.length : 1)
    .fill(0)
    .map((_) => uuid());

  const [ListArrState, setListArrState] = useState([...temp]);
  // const [IngrDataState, setIngrDataState] = useState([...ingredients]);

  const handlePlusList = () => {
    setListArrState((prev) => [...prev, uuid()]);
    setInputData((prev) => {
      let newItem = {
        name: "",
        contents: [
          ["", ""],
          ["", ""],
        ],
      };

      return { ...prev, ingredients: [...ingrData, newItem] };
    });
  };

  const handleDeleteList = (index) => {
    // 1개 이하면 초기화 시키기
    if (ListArrState.length <= 1) return;
    setListArrState((prev) => {
      let newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });

    setInputData((prev) => {
      let newState = [...ingrData];
      newState.splice(index, 1);
      return { ...prev, ingredients: [...newState] };
    });
  };

  return (
    <>
      <Container>
        {ListArrState.map((id, idx) => (
          <li key={id}>
            <IngredientInnerBox
              isFirst={idx === 0}
              data={ingrData[idx]}
              setData={setInputData}
              itemOrder={idx}
              handleDeleteList={() => handleDeleteList(idx)}
            />
          </li>
        ))}
      </Container>
      <SubContainer>
        <p className="desc">
          ※ 양념, 양념장, 소스, 드레싱, 토핑, 시럽, 육수 밑간 등으로 구분해서
          작성해주세요.
        </p>
        <p className="btn" onClick={handlePlusList}>
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>
          재료 단위 추가
        </p>
      </SubContainer>
    </>
  );
}

export default IngredientInputBox;
