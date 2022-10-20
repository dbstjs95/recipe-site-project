import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faUserFriends,
  faClock,
  faStar,
  faHeart as like,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";

const Container = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  margin: 0 auto;
`;

const MainImgBox = styled.div`
  background: ${(props) => `url(${props.main}) no-repeat center center`};
  background-size: cover;
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 120px;
  span.view_icon {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 3px 20px;
    border-radius: 15px;
  }
  figure {
    position: absolute;
    background: ${(props) => `url(${props.writer}) no-repeat center center`};
    background-size: 110px;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    transform: translate(-50%, 50%);
    bottom: 0;
    left: 50%;
    outline: 6px solid rgba(255, 255, 255, 0.6);
    span.nickname {
      position: absolute;
      transform: translate(-50%, 100%);
      bottom: -10px;
      left: 50%;
    }
  }
`;

const IntroBox = styled.div`
  width: 100%;
  h1.title {
    font-size: 30px;
    word-break: break-all;
  }
  pre.desc {
    color: #898c8a;
    font-size: 17px;
  }
`;

const DetailBox1 = styled.ul`
  /* border: 1px solid black; */
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 15px 0 30px;
  border-bottom: 1px solid lightgray;
  li {
    display: flex;
    flex-direction: column;
    color: #989c99;
    align-items: center;
    span {
      font-size: 1.5rem;
      margin-bottom: 3px;
    }
  }
`;

const DetailBox2 = styled.ul`
  /* border: 1px solid black; */
  display: flex;
  width: 60%;
  justify-content: space-between;
  padding: 20px 0 40px;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid rgba(207, 136, 4, 0.6);
    border-radius: 50%;
    font-size: 1.5rem;
    padding: 1rem;
    cursor: pointer;
    position: relative;
    span {
      font-size: 14px;
      transform: translate(-50%, 100%);
      position: absolute;
      bottom: -5px;
      left: 50%;
    }
  }
`;

function RecipeDetailIntro({ data }) {
  return (
    <Container>
      <MainImgBox main={data.mainSrc} writer={data?.userInfo?.src}>
        <span className="view_icon">
          <FontAwesomeIcon icon={faEye} /> {Number(data?.view).toLocaleString()}
        </span>
        <figure>
          <span className="nickname">{data.userInfo.nickname}</span>
        </figure>
      </MainImgBox>
      <IntroBox>
        <h1 className="title">{data.title}</h1>
        <pre className="desc">{data.intro}</pre>
      </IntroBox>
      <DetailBox1>
        {data?.details.map((item, idx) => {
          let iconType = [faUserFriends, faClock, faStar];
          return (
            <li key={idx}>
              <span>
                <FontAwesomeIcon icon={iconType[idx]} />
              </span>
              {item}
            </li>
          );
        })}
      </DetailBox1>
      <DetailBox2>
        <li>
          <FontAwesomeIcon icon={faHeart} />
          <span>{Number(data?.like).toLocaleString()}</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faComment} />
          <span>{data.commentsNum}</span>
        </li>
      </DetailBox2>
    </Container>
  );
}

export default RecipeDetailIntro;
