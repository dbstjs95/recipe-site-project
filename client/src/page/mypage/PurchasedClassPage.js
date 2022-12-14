import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Container as EntireBox, ContentPrivate } from "../mypage/MyRecipePage";
import { classes } from "../../mockData/class_list";
import Pagination from "../../components/Pagination";
import { HeaderStyle } from "./MyLikePage";
import { useQuery, useQueryClient } from "react-query";
import { useSetAuth } from "../../contexts/AuthContext";
import axios from "axios";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const { setHeader, user } = useOutletContext();

  const LIMIT = 15;
  const [PagingInfo, setPagingInfo] = useState({
    offset: 0,
    limit: LIMIT,
  });
  const [Count, setCount] = useState(0);

  const LocaleStringfn = (num) => Number(num).toLocaleString();

  const { data, isLoading, isError } = useQuery(
    ["getPurchasedList", PagingInfo],
    async ({ queryKey }) => {
      let { offset, limit } = queryKey[1];
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/user/classes?offset=${offset}&limit=${limit}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);

      if (result?.status === 200 && offset === 0) {
        setCount(result?.count);
      }

      return result;
    },
    {
      onSuccess: (data) => {},
      onError: (err) => {},
      onSettled: (data, err) => {
        let result = data?.authInfo || err?.response?.data?.authInfo;
        if (result) {
          let { isAuth, newToken } = result;
          if (!isAuth) {
            setAuth((prev) => false);
            queryClient.removeQueries("login");
            alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
            return navigate("/user/login");
          } else if (isAuth && newToken) {
            queryClient.setQueryData("login", (prev) => ({
              ...prev,
              token: newToken,
            }));
          }
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleClickItem = (item) => {
    let { class_id, src, title, price, deadline, payment_id } = item;
    let data = { header_img: src, header_title: title, price, deadline };
    navigate(`/classes/${class_id}/pay`, {
      state: { use: "afterPay", classData: data, paymentId: payment_id },
    });
  };

  return (
    <Container>
      <h1>
        <p>
          구매한 클래스 목록
          <div className="underline"></div>
        </p>
      </h1>
      <ListContainer>
        {data?.list?.map((item, idx) => {
          return (
            <li key={idx} onClick={() => handleClickItem(item)}>
              <img src={item?.src} />
              <div>
                <h2>{item?.title}</h2>
                <p className="detail">
                  <span className="price">{LocaleStringfn(item?.price)}원</span>
                  <span>구매완료</span>
                </p>
              </div>
            </li>
          );
        })}
      </ListContainer>
      <div id="pagination">
        <Pagination
          totalData={Count}
          dataLimit={LIMIT}
          setPagingInfo={setPagingInfo}
        />
      </div>
    </Container>
  );
}

export default PurchasedClassPage;
