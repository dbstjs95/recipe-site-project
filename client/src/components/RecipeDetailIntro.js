import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faUserFriends,
  faClock,
  faStar,
  faHeart as like,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { bucketUrl } from "../api/fileUpload";
import userImg from "../assets/logo_img/user.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  margin: 0 auto;
  padding: 20px 0;
  @media screen and (max-width: 768px) {
    width: 500px;
  }
  @media screen and (max-width: 600px) {
    width: 450px;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const MainImgBox = styled.div`
  background: ${(props) => `url(${props.main}) no-repeat center center`};
  background-size: cover;
  width: 100%;
  height: 0px;
  padding-bottom: 66.66%;
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
    background-size: cover;
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
      span.setting {
        position: absolute;
        top: 50%;
        right: -10px;
        transform: translate(100%, -50%);
        font-size: 18px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover em {
          display: block;
        }
        em {
          display: none;
          font-size: 13px;
          margin-left: 5px;
          color: crimson;
          font-weight: bold;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    margin-bottom: 110px;
    span.view_icon {
      font-size: 0.9em;
    }
    figure {
      width: 95px;
      height: 95px;
    }
  }
  @media screen and (max-width: 600px) {
    margin-bottom: 100px;
    span.view_icon {
      font-size: 0.8em;
    }
    figure {
      width: 85px;
      height: 85px;
      span.nickname {
        font-size: 15px;
      }
    }
  }
  @media screen and (max-width: 400px) {
    margin-bottom: 95px;
    figure {
      width: 80px;
      height: 80px;
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
    padding: 20px 10px;
    white-space: pre-line;
  }
  @media screen and (max-width: 768px) {
    h1.title {
      font-size: 28px;
    }
  }
  @media screen and (max-width: 600px) {
    h1.title {
      font-size: 25px;
    }
    pre.desc {
      font-size: 16px;
    }
  }
  @media screen and (max-width: 480px) {
    h1.title {
      padding: 0 10px;
      font-size: 23px;
    }
  }
  @media screen and (max-width: 380px) {
    h1.title {
      font-size: 21px;
    }
    pre.desc {
      font-size: 15px;
    }
  }
`;

const DetailBox1 = styled.ul`
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
  display: flex;
  width: 60%;
  justify-content: space-between;
  padding: 20px 0 25px;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(2, 95, 176, 1);
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
    @media screen and (max-width: 800px) {
      font-size: 1.3rem;
    }
    @media screen and (max-width: 600px) {
      font-size: 1.2rem;
    }
    @media screen and (max-width: 400px) {
      font-size: 1.1rem;
      span {
        font-size: 13px;
      }
    }
  }
`;

function RecipeDetailIntro({ data }) {
  const navigate = useNavigate();

  const [IsLiked, setIsLiked] = useState(data?.isLiked || false);
  const [LikeNum, setLikeNum] = useState(data?.like);

  const handleClickLike = () => {
    setIsLiked((prev) => {
      let newState = !prev;
      if (newState) {
        setLikeNum((prev) => prev + 1);
      } else {
        setLikeNum((prev) => prev - 1);
      }
      return newState;
    });
  };

  const handleModify = () => navigate("/modify/1");

  return (
    <Container>
      <MainImgBox
        main={`${bucketUrl}${data?.mainSrc}`}
        writer={
          data?.writer?.profile_img
            ? `${bucketUrl}${data?.writer?.profile_img}`
            : userImg
        }
      >
        <span className="view_icon">
          <FontAwesomeIcon icon={faEye} /> {Number(data?.view).toLocaleString()}
        </span>
        <figure>
          <span className="nickname">
            {data?.writer?.nickname}
            <span className="setting" onClick={handleModify}>
              <FontAwesomeIcon icon={faGear} />
              <em>수정</em>
            </span>
          </span>
        </figure>
      </MainImgBox>
      <IntroBox>
        <h1 className="title">{data?.title}</h1>
        <pre className="desc">{data?.intro}</pre>
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
          <FontAwesomeIcon
            onClick={handleClickLike}
            icon={IsLiked ? like : faHeart}
          />
          <span>{Number(LikeNum).toLocaleString()}</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faComment} />
          <span>{data?.commentsNum}</span>
        </li>
      </DetailBox2>
    </Container>
  );
}

export default RecipeDetailIntro;
