import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  background-color: whitesmoke;
  padding: 20px 0;
  > #top_btn {
    visibility: visible;
    opacity: 1;
    position: fixed;
    transform: translateY(-50%);
    top: 50%;
    right: 30px;
    background-color: gray;
    color: white;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    opacity: 0.8;
    cursor: pointer;
    transition-duration: 0.3s;
    @media screen and (max-width: 1024px) {
      visibility: hidden;
      opacity: 0;
    }
    span {
      &.icon {
        display: none;
      }
    }
    &:hover {
      background-color: lightgray;
      color: #333;
      span {
        &.text {
          display: none;
        }
        &.icon {
          display: block;
        }
      }
    }
  }
`;

function App() {
  return (
    <>
      <NavBar />
      <Container>
        <Outlet />
        <TopBtn />
      </Container>
      <Footer />
    </>
  );
}

function TopBtn() {
  const [ShowButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return (
    ShowButton && (
      <div id="top_btn" onClick={scrollToTop}>
        <span className="text">Top</span>
        <span className="icon">
          <FontAwesomeIcon icon={faAngleDoubleUp} />
        </span>
      </div>
    )
  );
}

export default App;
