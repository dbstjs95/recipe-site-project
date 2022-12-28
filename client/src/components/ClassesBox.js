import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useSetAuth } from "../contexts/AuthContext";
import axios from "axios";
import { bucketUrl } from "../api/fileUpload";
import { Fetching, Loading, Error } from "./States";

export const LiStyleForClass = css`
  > div.container {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    border-radius: 7px;
  }
  a {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
  }
  p.title {
    word-break: break-all;
    font-weight: bold;
    padding: 10px 0;
  }
  p.details {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 5% 5px;
    span {
      &.price {
        font-size: 18px;
        font-weight: bolder;
        color: crimson;
      }
      &.sales {
        font-size: 12px;
        color: gray;
      }
    }
  }
`;

const ClassSection = styled.section`
  position: relative;
  div.hide-box {
    width: 95%;
    margin: 0 auto;
    padding: 0 10px;
    overflow: hidden;
    position: relative;
    &:hover button {
      &.prev {
        left: -10px;
      }
      &.next {
        right: -10px;
      }
    }
    button {
      transition: all 0.2s linear;
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      padding: 3px 10px;
      font-size: 3em;
      font-weight: bolder;
      color: gray;
      z-index: 5;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      &:disabled {
        color: lightgray;
      }
      &.prev {
        left: -80px;
      }
      &.next {
        right: -80px;
      }
    }
  }
`;

const UlContainer = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  transform: translateX(0%);
  padding-top: 1%;
  li {
    min-width: 33.333%;
    min-height: 100%;
    @media screen and (max-width: 960px) {
      min-width: 50%;
    }
    @media screen and (max-width: 600px) {
      min-width: 100%;
    }

    ${LiStyleForClass};
  }
`;

//test
const ImgBox = styled.div`
  background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
  width: 100%;
  height: 0px;
  padding-bottom: 55%;
  background-size: 100%;
  transition: background-size 0.5s;
  &:hover {
    background-size: 110%;
  }
`;

export function ClassesInnerBox({ data = [] }) {
  return (
    <>
      {data.map((item, idx) => {
        let refinedPrice = Number(item?.price).toLocaleString("ko-KR");
        return (
          <li key={idx}>
            <div className="container">
              <Link to={`/classes/${item?.class_id}`}>
                <ImgBox imgSrc={bucketUrl + item?.src} />
                <p className="title">{item?.title}</p>
                <p className="details">
                  <span className="price">{refinedPrice}원</span>
                  <span className="sales">{item?.sales}명 신청</span>
                </p>
              </Link>
            </div>
          </li>
        );
      })}
    </>
  );
}

function ClassesBox({ children, setHeader }) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const classRef = useRef(null);
  const [TotalSlide, setTotalSlide] = useState(0);
  const [SlideState, setSlideState] = useState(0);
  const [MaxState, setMaxState] = useState(null);

  const user = queryClient.getQueryData("login");

  const {
    data: listData,
    isLoading,
    isError,
    isFetching,
  } = useQuery(
    ["mainClasses"],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/class?category=전체&offset=0&limit=12`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);

      if (user && result?.authInfo) {
        let { isAuth, newToken } = result?.authInfo;
        if (!isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
        } else if (isAuth && newToken) {
          queryClient.setQueryData("login", (prev) => ({
            ...prev,
            token: newToken,
          }));
        }
      }

      if (result?.status === 200) {
        let count = result?.list?.length;
        setTotalSlide(count);
        return result?.list;
      }
      return null;
    },
    { refetchOnWindowFocus: false }
  );

  const handlePrev = () =>
    setSlideState((prev) => {
      let size = classRef.current.clientWidth;
      classRef.current.style.transition = `all 0.5s linear`;
      classRef.current.style.transform = `translateX(-${size * (prev - 1)}px)`;
      return prev - 1;
    });

  const handleNext = () => {
    setSlideState((prev) => {
      let size = classRef.current.clientWidth;
      classRef.current.style.transition = `all 0.5s linear`;
      classRef.current.style.transform = `translateX(-${size * (prev + 1)}px)`;
      return prev + 1;
    });
  };

  const controlSize = () => {
    let size = window.innerWidth;

    if (size <= 600) {
      setMaxState(TotalSlide - 1);
    } else if (size <= 960) {
      setMaxState(Math.ceil(TotalSlide / 2) - 1);
    } else {
      setMaxState(Math.ceil(TotalSlide / 3) - 1);
    }
  };

  const resizeEvent = () => {
    controlSize();
    classRef.current.style.transition = ``;
    classRef.current.style.transform = `translateX(0px)`;
    setSlideState(0);
  };

  useEffect(() => {
    controlSize();
    window.addEventListener("resize", resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  });

  if (isLoading) return <Loading height="30vh" size="70" type="dots" />;
  if (isError) return <Error height="40vh" />;

  return (
    <ClassSection>
      {isFetching && (
        <Fetching position="absolute" size="50" color="lightgray" bgColor="" />
      )}
      {children}
      <div className="hide-box">
        <button
          className="prev"
          onClick={handlePrev}
          disabled={SlideState === 0}
        >
          &lt;
        </button>
        <button
          className="next"
          onClick={handleNext}
          disabled={SlideState === MaxState}
        >
          &gt;
        </button>
        <UlContainer ref={classRef}>
          <ClassesInnerBox data={listData} />
        </UlContainer>
      </div>
    </ClassSection>
  );
}

export default ClassesBox;
