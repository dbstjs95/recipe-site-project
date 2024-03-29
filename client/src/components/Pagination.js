import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "../css";

const Container = styled.ul`
  display: inline-flex;
  /* justify-content: center; */
  align-items: center;
  margin: 0 auto;
  padding: 0 20px;
  li {
    color: #545352;
    border: 1px solid lightgrey;
    padding: 5px 13px;
    cursor: pointer;
    &:not(:last-of-type) {
      margin-right: 10px;
    }
    &:hover,
    &.selected {
      box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ArrowBtn = styled.button`
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.main};
  &:disabled {
    cursor: default;
    opacity: 0;
    color: lightgray;
  }
  &.prev {
  }
  &.next {
  }
`;

function Pagination({
  totalData = 0,
  dataLimit = 20,
  pageLimit = 10,
  setPagingInfo,
  PagingInfo,
}) {
  const [Offset, setOffset] = useState(0);
  const [Selected, setSelected] = useState(1);
  const DATA_LIMIT = dataLimit;
  const PAGE_LIMIT = pageLimit;
  const TOTAL_PAGE = Math.ceil(Number(totalData) / DATA_LIMIT);
  const LAST_PAGE =
    TOTAL_PAGE === 0
      ? 0
      : (Math.ceil(Number(TOTAL_PAGE) / PAGE_LIMIT) - 1) * PAGE_LIMIT;

  const num_list = Array(TOTAL_PAGE)
    .fill(0)
    .map((_, i) => i + 1);

  const handlePrevClick = () =>
    setOffset((prevState) => {
      let newState = prevState - PAGE_LIMIT;
      setSelected((pre) => newState + PAGE_LIMIT);
      return newState;
    });

  const handleNextClick = () =>
    setOffset((prevState) => {
      let newState = prevState + PAGE_LIMIT;
      setSelected((pre) => newState + 1);
      return newState;
    });

  const handleSelect = (num) => {
    setSelected(num);
  };

  useEffect(() => {
    if (!setPagingInfo) return;
    let offset = DATA_LIMIT * (Number(Selected) - 1);
    setPagingInfo((prev) => ({ ...prev, offset }));
  }, [Selected]);

  useEffect(() => {
    if (!PagingInfo) return;
    if (PagingInfo?.offset === 0) setSelected(1);
  }, [PagingInfo]);

  return (
    <>
      <ArrowBtn
        className="prev"
        onClick={handlePrevClick}
        disabled={Offset === 0}
      >
        {"<<"}
      </ArrowBtn>
      <Container>
        {num_list.slice(Offset, Offset + PAGE_LIMIT).map((num) => (
          <li
            key={num}
            className={Selected === num ? "selected" : ""}
            onClick={() => handleSelect(num)}
          >
            {num}
          </li>
        ))}
      </Container>
      <ArrowBtn
        className="next"
        onClick={handleNextClick}
        disabled={Offset === LAST_PAGE}
      >
        {">>"}
      </ArrowBtn>
    </>
  );
}

export default Pagination;
