import React from "react";
import styled from "styled-components";
import { LayoutSize, ContainerStyle } from "../css";
import {
  dataForRegisterPage as data,
  dataKeys1,
  dataKeys2,
} from "../mockData/category_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons";

// border: 1px solid red;
const titleColor = "#5e5e5e";
const Container = styled.div`
  ${LayoutSize}
  ${ContainerStyle}
  background-color: rgba(221, 240, 216, 0.3);
  border-radius: 0;
  h1 {
    font-size: 25px;
    font-weight: bold;
    padding: 10px 15px;
    background-color: rgba(7, 115, 61, 0.7);
    color: #fff;
    @media screen and (max-width: 960px) {
      font-size: 23px;
    }
    @media screen and (max-width: 768px) {
      font-size: 21px;
    }
    @media screen and (max-width: 580px) {
      text-align: center;
      font-size: 20px;
    }
  }
`;

const InputBox1 = styled.form`
  padding: 30px 0 40px;
  > div,
  > p {
    width: 90%;
    margin: 0 auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: white;
    @media screen and (max-width: 1024px) {
      width: 100%;
    }
  }
  > div {
    margin-bottom: 10px;
  }
`;

const IntroContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: stretch;
  @media screen and (max-width: 768px) {
    padding: 0;
  }
  > ul {
    width: 70%;
  }
  > div {
    width: 30%;
    padding-top: 20px;
  }
  @media screen and (max-width: 768px) {
    > ul {
      width: 65%;
    }
    > div {
      width: 35%;
    }
  }
  @media screen and (max-width: 600px) {
    > ul {
      width: 100%;
    }
    > div {
      width: 100%;
      padding-top: 0;
    }
  }
  > ul#input_info {
    /* background-color: skyblue; */
    li {
      display: flex;
      padding: 20px 15px;
      &:first-child {
        align-items: center;
      }
      h2 {
        font-size: 22px;
        font-weight: bold;
        width: 30%;
        color: ${titleColor};
      }
      input[type="text"] {
        height: 40px;
        width: 70%;
        padding: 0 10px;
        font-size: 16px;
      }
      textarea {
        height: 120px;
        width: 70%;
        resize: none;
      }
      select {
        margin: 0 3px;
        background-color: #fff;
      }
      input[type="text"],
      textarea,
      select {
        border: 1px solid #b8b8b8;
      }
      @media screen and (max-width: 1220px) {
        h2 {
          font-size: 20px;
        }
      }
      @media screen and (max-width: 1024px) {
        h2 {
          font-size: 19px;
        }
        input[type="text"] {
          height: 38px;
        }
      }
      @media screen and (max-width: 768px) {
        &:first-child {
          align-items: stretch;
        }
        &:first-child,
        &:nth-child(2) {
          flex-direction: column;
        }
        h2 {
          font-size: 17px;
          margin-bottom: 5px;
        }
        input[type="text"] {
          height: 36px;
          font-size: 14px;
        }
        h2,
        input[type="text"],
        textarea {
          width: 100%;
        }
        select {
          font-size: 14px;
        }
      }
      @media screen and (max-width: 360px) {
        &:nth-child(3),
        &:nth-child(4) {
          flex-direction: column;
          select {
            font-size: 16px;
          }
        }
      }
    }
  }
  > div#upload_file {
    /* background-color: yellow; */
    label {
      /* display: block; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 200px;
      border: 1px solid lightgray;
      background-color: rgba(0, 0, 0, 0.05);
      margin: 0 auto;
      span {
        &.icon {
          font-size: 2em;
        }
        &.desc {
          color: gray;
          font-size: 13px;
        }
      }
      @media screen and (max-width: 960px) {
        width: 180px;
        height: 180px;
      }
      @media screen and (max-width: 768px) {
        width: 160px;
        height: 160px;
      }
      @media screen and (max-width: 600px) {
        width: 220px;
        height: 220px;
        margin: 10px 25px 20px auto;
      }
      @media screen and (max-width: 380px) {
        width: 200px;
        height: 200px;
        margin: 10px auto 20px;
      }
    }
    input[type="file"] {
      display: none;
    }
  }
  /* 화면 너비 0 ~ 1220px */
  /* 화면 너비 0 ~ 1024px */
  /* 화면 너비 0 ~ 960px */
  /* 화면 너비 0 ~ 768px */
  /* 화면 너비 0 ~ 600px */
  /* 화면 너비 0 ~ 480px */
  /* 화면 너비 0 ~ 320px */
`;

const IngredientContainer = styled.div`
  min-height: 200px;
`;
const OrderContainer = styled.div`
  min-height: 400px;
`;
const BtnContainer = styled.p`
  border: 1px solid blue;
  min-height: 100px;
  button {
    &.save {
    }
    &.release {
    }
    &.cancel {
    }
  }
`;

function RegisterRecipePage() {
  const preventEvent = (e) => {
    e.preventDefault();
    console.log("클릭");
  };
  return (
    <Container>
      <h1>레시피 등록</h1>
      <InputBox1>
        <IntroContainer>
          <ul id="input_info">
            <li>
              <h2>레시피 제목</h2>
              <input type="text" />
            </li>
            <li>
              <h2>요리 간단소개</h2>
              <textarea />
            </li>
            <li>
              <h2>카테고리</h2>
              {dataKeys1.map((prop, idx) => (
                <select key={idx}>
                  {data[prop].map((item, idx) => (
                    <option value={item} key={idx} selected={idx === 0}>
                      {item}
                    </option>
                  ))}
                </select>
              ))}
            </li>
            <li>
              <h2>요리정보</h2>
              {dataKeys2.map((prop, idx) => (
                <select key={idx}>
                  {data[prop].map((item, idx) => (
                    <option value={item} key={idx} selected={idx === 0}>
                      {item}
                    </option>
                  ))}
                </select>
              ))}
            </li>
          </ul>
          <div id="upload_file">
            <label htmlFor="select_img">
              <span className="icon">
                <FontAwesomeIcon icon={faBowlFood} />
              </span>
              <span className="desc">음식 대표 사진 입력</span>
            </label>
            <input
              id="select_img"
              type="file"
              accept="image/jpg, image/png, image/jpeg"
              onClick={preventEvent}
              onChange={(e) => console.log(e.target.files[0])}
            />
          </div>
        </IntroContainer>
        <IngredientContainer></IngredientContainer>
        <OrderContainer></OrderContainer>
        <BtnContainer>
          <button className="save">저장</button>
          <button className="release">저장 후 공개하기</button>
          <button className="cancel">취소</button>
        </BtnContainer>
      </InputBox1>
    </Container>
  );
}

export default RegisterRecipePage;
