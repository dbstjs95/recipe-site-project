import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { classes } from "../mockData/class_list";

const ClassSection = styled.section`
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
    ul.list {
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
        > div {
          width: 80%;
          height: 100%;
          margin: 0 auto;
          padding: 8px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        img {
          width: 100%;
          border-radius: 7px;
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
      }
    }
  }
`;

function ClassesBox({ children }) {
  const totalSlide = classes.length;
  const classRef = useRef(null);
  const [SlideState, setSlideState] = useState(0);
  const [MaxState, setMaxState] = useState(null);

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
      setMaxState(totalSlide - 1);
    } else if (size <= 960) {
      setMaxState(Math.ceil(totalSlide / 2) - 1);
    } else {
      setMaxState(Math.ceil(totalSlide / 3) - 1);
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
  }, []);

  return (
    <ClassSection>
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
        <ul className="list" ref={classRef}>
          {classes.map((item, idx) => {
            let refinedPrice = Number(item.price).toLocaleString("ko-KR");
            return (
              <li key={idx}>
                <div>
                  <img src={item.src} alt="클래스" />
                  <p className="title">{item.title}</p>
                  <p className="details">
                    <span className="price">{refinedPrice}원</span>
                    <span className="sales">{item.sales}명 신청</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ClassSection>
  );
}

export default ClassesBox;