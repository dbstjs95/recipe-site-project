import React, { useState } from "react";
import styled from "styled-components";
import { classMenuIcons } from "../../mockData/food_icon";
import { LayoutSize, ContainerStyle } from "../../css";
import { LiStyleForClass, ClassesInnerBox } from "../../components/ClassesBox";
import Pagination from "../../components/Pagination";
import { useQuery } from "react-query";
import axios from "axios";

const Container = styled.div`
  ${LayoutSize};
  ${ContainerStyle};
  div#paginationLayout {
    text-align: center;
    padding: 30px 0;
  }
`;

const MenuContainer = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid lightgray;
    flex: 1;
    cursor: pointer;
    &:not(:last-of-type) {
      border-right: 1px solid lightgray;
    }
    &:hover,
    &.selected {
      /* box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1); */
      box-shadow: inset 0 0 50px rgba(104, 105, 104, 0.3);
    }
    img {
      width: 40px;
      margin-right: 10px;
    }
    span {
      font-size: 20px;
    }
    @media screen and (max-width: 1220px) {
      img {
        width: 35px;
      }
      span {
        font-size: 18px;
      }
    }
    @media screen and (max-width: 1024px) {
      img {
        width: 30px;
      }
      span {
        font-size: 16px;
      }
    }
    @media screen and (max-width: 768px) {
      img {
        width: 26px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    margin: 0 0 30px;
    li {
      width: 33.333%;
      flex: 0 1 auto;
      &:nth-child(3n) {
        border-right: 0;
      }
      &:last-child {
        width: 100%;
        border-bottom: 0;
      }
      span {
        font-size: 15px;
      }
    }
  }
`;

const ListContainer = styled.div`
  ul {
    margin: 0px auto;
    width: 95%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, auto));
    li {
      margin-bottom: 25px;
      ${LiStyleForClass};
      > div {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      }
      p.title {
        padding: 10px 5px;
      }
      p.details {
        padding: 0 5px 5%;
      }
    }
  }
`;

function ClassListPage() {
  const LIMIT = 12;
  const [Count, setCount] = useState(0);
  const [PagingInfo, setPagingInfo] = useState({
    category: "전체",
    offset: 0,
    limit: LIMIT,
  });

  const handleMenuClick = (val) =>
    setPagingInfo((prev) => ({ ...prev, category: val }));

  const {
    data: listData,
    isLoading,
    isError,
  } = useQuery(
    ["classList", PagingInfo],
    async ({ queryKey }) => {
      let { category, offset, limit } = queryKey[1];
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/class?category=${category}&offset=${offset}&limit=${limit}`
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        if (offset === 0) setCount(result?.count);
        return result?.list;
      }
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Container>
      <MenuContainer>
        {classMenuIcons.map((item, idx) => (
          <li
            key={idx}
            className={PagingInfo?.category === item?.name ? "selected" : ""}
            onClick={() => handleMenuClick(item.name)}
          >
            <img src={item.src} alt={item.name} />
            <span>{item.name}</span>
          </li>
        ))}
      </MenuContainer>
      <ListContainer>
        <ul>
          <ClassesInnerBox data={listData} />
        </ul>
      </ListContainer>
      <div id="paginationLayout">
        <Pagination
          totalData={Count}
          dataLimit={LIMIT}
          setPagingInfo={setPagingInfo}
        />
      </div>
    </Container>
  );
}

export default ClassListPage;
