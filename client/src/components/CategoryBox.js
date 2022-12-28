import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  typeData,
  circumstanceData,
  ingredientData,
} from "../mockData/category_data";
import { colors } from "../css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 70%;
  margin: 0 auto;
  tbody {
    tr {
      th {
        display: flex;
        flex-direction: column;

        span {
          font-size: 17px;
          padding: 10px;
          margin-right: 10px;
          border-right: 1px solid lightgray;
        }
      }
      td {
        .list {
          padding: 10px 0;
          span {
            padding: 3px 8px 4px;
            white-space: nowrap;
            cursor: pointer;
            &.active {
              background-color: ${colors.main};
              color: #fff;
              border-radius: 16px;
            }
          }
        }
      }
    }
  }
`;

const CategoryBtn = styled.div`
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  width: 100%;
  text-align: center;
  padding: 10px 0;
  > p {
    display: inline-block;
    cursor: pointer;
    > span {
      &.text {
        white-space: nowrap;
        margin-right: 10px;
      }
      &.icon {
        color: #636261;
      }
    }
  }
`;

function CategoryBox({ state, InitialCategory, setPagingInfo }) {
  const [IsOpen, setIsOpen] = useState(state);
  const [CategoryValue, setCategoryValue] = useState(InitialCategory);
  const tableRef = useRef(null);

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleCategoryClick = (key, value) =>
    setCategoryValue((prevState) => {
      let newState = { ...prevState, [key]: value };
      let category = "";
      for (let key in newState) {
        category += newState[key];
        if (key !== "ingredient") {
          category += ",";
        }
      }
      setPagingInfo((prev) => ({ ...prev, category, offset: 0 }));
      return newState;
    });

  useEffect(() => {
    if (IsOpen) {
      tableRef.current.style.display = "table";
    } else {
      tableRef.current.style.display = "none";
    }
  }, [IsOpen]);

  return (
    <>
      <Container>
        <Table ref={tableRef}>
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>
                <span>종류별</span>
                <span>상황별</span>
                <span>재료별</span>
              </th>
              <td>
                <div className="lists">
                  <div className="list type">
                    {typeData.map((item, idx) => (
                      <span
                        key={idx}
                        type={idx}
                        className={CategoryValue.type === item ? "active" : ""}
                        onClick={() => handleCategoryClick("type", item)}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="list circumstance">
                    {circumstanceData.map((item, idx) => (
                      <span
                        key={idx}
                        type={idx}
                        className={
                          CategoryValue.circumstance === item ? "active" : ""
                        }
                        onClick={() =>
                          handleCategoryClick("circumstance", item)
                        }
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="list ingredient">
                    {ingredientData.map((item, idx) => (
                      <span
                        key={idx}
                        type={idx}
                        className={
                          CategoryValue.ingredient === item ? "active" : ""
                        }
                        onClick={() => handleCategoryClick("ingredient", item)}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <CategoryBtn>
        <p onClick={handleClick}>
          {IsOpen ? (
            <>
              <span className="text">카테고리 닫기</span>
              <span className="icon">
                <FontAwesomeIcon icon={faAngleDoubleUp} />
              </span>
            </>
          ) : (
            <>
              <span className="text">카테고리 열기</span>
              <span className="icon">
                <FontAwesomeIcon icon={faAngleDoubleDown} />
              </span>
            </>
          )}
        </p>
      </CategoryBtn>
    </>
  );
}

export default CategoryBox;
