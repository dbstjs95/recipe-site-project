import React from "react";
import styled from "styled-components";
import noData from "../assets/noData.png";
import noWay from "../assets/noway.png";
import {
  RotatingLines,
  Comment,
  ThreeDots,
  TailSpin,
  ProgressBar,
} from "react-loader-spinner";

const Container1 = styled.div`
  /* border: 1px solid red; */
  height: ${({ height }) => height};
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    /* border: 1px solid gray; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  img {
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    width: ${({ imgSize }) => imgSize?.w};
    height: ${({ imgSize }) => imgSize?.h};
    object-fit: cover;
  }
  p {
    margin-top: ${({ interval }) => interval};
    font-size: 18px;
    font-weight: bold;
    color: #6b6a6a;
  }
`;
const Container2 = styled.div`
  height: ${({ height }) => height};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container3 = styled.div`
  height: ${({ height }) => height};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: ${({ imgSize }) => imgSize};
    object-fit: cover;
  }
  p {
    margin-top: 20px;
    font-size: ${({ fontSize }) => fontSize};
    font-weight: bold;
    color: crimson;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

const Container4 = styled.div`
  /* border: 2px solid red; */
  background-color: ${({ bgColor }) => bgColor};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: ${({ position }) => position};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
`;

export function Nodata({
  height = "50vh",
  imgSize = { w: "100px", h: "100px" },
  text = "데이터가 없습니다.",
  interval = "10px",
}) {
  return (
    <Container1 height={height} imgSize={imgSize} interval={interval}>
      <div>
        <img src={noData} />
        <p>{text}</p>
      </div>
    </Container1>
  );
}

export function Loading({ type, height = "50vh", size = "70" }) {
  if (type === "dots")
    return (
      <Container2 height={height}>
        <ThreeDots
          height={size}
          width={size}
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </Container2>
    );

  if (type === "rotate")
    return (
      <Container2 height={height}>
        <RotatingLines
          strokeColor="#4fa94d"
          strokeWidth="5"
          animationDuration="0.75"
          width={size}
          visible={true}
        />
      </Container2>
    );

  if (type === "comment")
    return (
      <Container2 height={height}>
        <Comment
          visible={true}
          height={size}
          width={size}
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="comment-wrapper"
          color="#fff"
          backgroundColor="#4fa94d"
        />
      </Container2>
    );

  // spin
  return (
    <Container2 height={height}>
      <TailSpin
        height={size}
        width={size}
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Container2>
  );
}

export function Error({
  height = "75vh",
  imgSize = "250px",
  fontSize = "30px",
}) {
  return (
    <Container3 height={height} imgSize={imgSize} fontSize={fontSize}>
      <img src={noWay} alt="error img" />
      <p>ERROR!</p>
    </Container3>
  );
}

export function Fetching({
  position = "fixed",
  type,
  size = "70",
  color = "#4fa94d",
  bgColor = "rgba(0, 0, 0, 0.2)",
}) {
  if (type === "dots") {
    return (
      <Container4 position={position} bgColor={bgColor}>
        <ThreeDots
          height={size}
          width={size}
          radius="9"
          color={color}
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </Container4>
    );
  }

  if (type === "rotate") {
    return (
      <Container4 position={position} bgColor={bgColor}>
        <RotatingLines
          strokeColor={color}
          strokeWidth="5"
          animationDuration="0.75"
          width={size}
          visible={true}
        />
      </Container4>
    );
  }

  if (type === "comment") {
    return (
      <Container4 position={position} bgColor={bgColor}>
        <Comment
          visible={true}
          height={size}
          width={size}
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="comment-wrapper"
          color="#fff"
          backgroundColor={color}
        />
      </Container4>
    );
  }

  if (type === "progress") {
    return (
      <Container4 position={position} bgColor={bgColor}>
        <ProgressBar
          height={size}
          width={size}
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass="progress-bar-wrapper"
          borderColor="#F4442E"
          barColor={color}
        />
      </Container4>
    );
  }

  // spin
  return (
    <Container4 position={position} bgColor={bgColor}>
      <TailSpin
        height={size}
        width={size}
        color={color}
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Container4>
  );
}
