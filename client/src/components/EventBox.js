import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { events } from "../mockData/event_list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function EventBox() {
  const [SlideState, setSlideState] = useState(0);
  const [BtnDisplay, setBtnDisplay] = useState(false);
  const MAX_SLIDES = events.length - 1;
  const slideRef = useRef(null);

  const setTransition = (value) => {
    slideRef.current.style.transition = value;
  };

  const setTranslate = (index) => {
    slideRef.current.style.transform = `translate(-${
      (index + 1) * slideRef.current.clientWidth
    }px, 0)`;
  };

  const handleBannerLeft = () => {
    let newSlideState = SlideState - 1;
    setTransition("all 1s linear");
    setTranslate(newSlideState);
    if (newSlideState < 0) {
      newSlideState = MAX_SLIDES;
      setTimeout(() => {
        setTransition("");
        setTranslate(newSlideState);
      }, 1000);
    }
    setSlideState((prevState) => newSlideState);
  };

  const handleBannerRight = () => {
    let newSlideState = SlideState + 1;
    setTransition("all 1s linear");
    setTranslate(newSlideState);

    if (newSlideState > MAX_SLIDES) {
      newSlideState = 0;
      setTimeout(() => {
        setTransition("");
        setTranslate(0);
      }, 1000);
    }
    setSlideState((prevState) => newSlideState);
  };

  const handleMouseOver = () => {
    setBtnDisplay(true);
  };

  const handleMouseOut = () => {
    setBtnDisplay(false);
  };

  useEffect(() => {
    slideRef.current.style.transform = `translate(-${slideRef.current.clientWidth}px, 0)`;
  }, []);

  useEffect(() => {
    let interval = setInterval(handleBannerRight, 5000);
    return () => clearInterval(interval);
  }, [SlideState]);

  return (
    <Banner onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {BtnDisplay && (
        <>
          <PrevBtn onClick={handleBannerLeft}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </PrevBtn>
          <NextBtn onClick={handleBannerRight}>
            <FontAwesomeIcon icon={faChevronRight} />
          </NextBtn>
        </>
      )}
      <HideBox>
        <ul className="banner_images" ref={slideRef}>
          <li className="item">
            <img src={events[events.length - 1].src} />
          </li>
          {events.map((event, idx) => (
            <li className="item" key={idx}>
              <img src={event.src} />
            </li>
          ))}
          <li className="item">
            <img src={events[0].src} />
          </li>
        </ul>
      </HideBox>
    </Banner>
  );
}

const Banner = styled.section`
  position: relative;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HideBox = styled.div`
  width: 90%;
  height: 100px;
  overflow: hidden;
  ul.banner_images {
    width: 100%;
    height: 100%;
    display: flex;
    transform: translate(0, 0);
    li.item {
      flex: 0 0 100%;
      padding: 0 5px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.span`
  position: absolute;
  top: 50%;
  color: gray;
  font-size: 2em;
  cursor: pointer;
  z-index: 1;
`;

const PrevBtn = styled(Button)`
  left: 5%;
  transform: translate(-50%, -50%);
`;
const NextBtn = styled(Button)`
  right: 5%;
  transform: translate(50%, -50%);
`;

export default EventBox;
