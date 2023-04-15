import React from "react";
import styled from "styled-components";
import { H2Style } from "./RecipeDetailIngr";
import { bucketUrl } from "../api/fileUpload";
import userImg from "../assets/logo_img/user.png";

const Container = styled.div`
  padding: 20px 15px;
  width: 80%;
  margin: 0 auto;
  @media screen and (max-width: 600px) {
    width: 100%;
  }
  h2 {
    ${H2Style};
  }
  > div {
    display: flex;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      margin-right: 20px;
    }
    > p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        &.nickname {
          font-size: 18px;
          font-weight: bold;
        }
        &.greetings {
          padding: 5px 0;
          @media screen and (max-width: 800px) {
            font-size: 15px;
          }
          @media screen and (max-width: 500px) {
            font-size: 14px;
          }
          @media screen and (max-width: 400px) {
            font-size: 13px;
            padding: 2px 0;
          }
        }
      }
    }
    @media screen and (max-width: 960px) {
      img {
        width: 70px;
        height: 70px;
      }
      > p {
        span {
          &.nickname {
            font-size: 17px;
          }
        }
      }
    }
    @media screen and (max-width: 400px) {
      img {
        width: 60px;
        height: 60px;
      }
      > p {
        span {
          &.nickname {
            font-size: 15px;
          }
        }
      }
    }
  }
`;

function RecipeDetailWriter({ data }) {
  const changeUrl = (url = "") => {
    if (!url) return userImg;
    if (url?.startsWith("upload/user/")) {
      return bucketUrl + url;
    } else return url;
  };

  return (
    <Container>
      <h2>레시피 작성자</h2>
      <div>
        <img src={changeUrl(data?.profile_img)} alt="프로필 이미지" />
        <p>
          <span className="nickname">{data?.nickname}</span>
          <span className="greetings">{data?.profile_desc}</span>
        </p>
      </div>
    </Container>
  );
}

export default RecipeDetailWriter;
