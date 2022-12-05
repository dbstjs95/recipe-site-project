import React from "react";
import styled from "styled-components";
import { Link, useOutletContext } from "react-router-dom";
import { Container as EntireBox, ContentPrivate } from "../mypage/MyRecipePage";
import { classes } from "../../mockData/class_list";
import Pagination from "../../components/Pagination";
import { HeaderStyle } from "./MyLikePage";
import { useQuery, useQueryClient } from "react-query";
import { useSetAuth } from "../../contexts/AuthContext";

const purchasedClasses = [...classes].slice(0, 5);
const Container = styled(EntireBox)`
  h1 {
    ${HeaderStyle};
  }
`;

const ListContainer = styled(ContentPrivate)`
  p.detail {
    display: flex;
    flex-direction: column;
    span {
      color: #777;
      &.price {
        font-size: 18px;
        font-weight: bold;
        color: black;
      }
      @media screen and (max-width: 600px) {
        font-size: 13px;
        &.price {
          font-size: 16px;
        }
      }
    }
  }
`;

function PurchasedClassPage() {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const { setHeader, user } = useOutletContext();

  const LocaleStringfn = (num) => Number(num).toLocaleString();

  return (
    <Container>
      <h1>
        <p>
          구매한 클래스 목록
          <div className="underline"></div>
        </p>
      </h1>
      <ListContainer>
        {purchasedClasses.map((item, idx) => {
          return (
            <li key={idx}>
              <img src={item.src} />
              <div>
                <Link>
                  <h2>{item.title}</h2>
                </Link>
                <p className="detail">
                  <span className="price">{LocaleStringfn(item.price)}원</span>
                  <span>구매완료</span>
                </p>
              </div>
            </li>
          );
        })}
      </ListContainer>
      <div id="pagination">
        <Pagination totalData={5} dataLimit={5} />
      </div>
    </Container>
  );
}

export default PurchasedClassPage;
