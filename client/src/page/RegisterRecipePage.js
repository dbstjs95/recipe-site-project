import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { LayoutSize, ContainerStyle } from "../css";
import {
  dataForRegisterPage as data,
  dataKeys1,
  dataKeys2,
} from "../mockData/category_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons";
import IngredientInputBox from "../components/IngredientInputBox";
import OrderInputBox from "../components/OrderInputBox";
import RegisterBtn from "../components/RegisterBtn";
import { FileFirst, bucketUrl } from "../api/fileUpload";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";

const titleColor = "#5e5e5e";
const inputColor = "#b8b8b8";

const Container = styled.div`
  ${LayoutSize}
  ${ContainerStyle}
  background-color: rgba(221, 240, 216, 0.3);
  border-radius: 0;
  h1 {
    font-size: 25px;
    font-weight: bold;
    padding: 10px 15px;
    background-color: white;
    border-top: 10px double rgba(7, 115, 61, 0.7);
    border-bottom: 10px double rgba(7, 115, 61, 0.7);
    color: #3d5c46;
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

const InputBox = styled.form`
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
    li {
      display: flex;
      padding: 20px 15px;
      &:first-child {
        align-items: center;
      }
      h2 {
        font-size: 21px;
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
        padding: 10px;
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
        }
        input[type="text"],
        textarea {
          font-size: 15px;
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
    div.main_img {
      /* display: block; */
      ${({ mainSrc }) =>
        mainSrc
          ? css`
              background: url(${mainSrc}) no-repeat center center;
              background-size: cover;
            `
          : css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: rgba(0, 0, 0, 0.05);
            `}
      width: 200px;
      height: 200px;
      border: 1px solid lightgray;
      margin: 0 auto;
      span {
        ${({ mainSrc }) =>
          mainSrc &&
          css`
            display: none;
          `}
        &.icon {
          font-size: 2em;
          margin-bottom: 5px;
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
`;

const IngredientContainer = styled.div`
  padding: 30px 0 10px;
`;
const OrderContainer = styled.div``;
const BtnContainer = styled.div``;

function RegisterRecipePage({ myRecipeData, modifyMode }) {
  // const queryClient = useQueryClient();
  // const navigate = useNavigate();
  // const location = useLocation();

  let emptyData = {
    title: "",
    mainSrc: "",
    intro: "",
    category: ["", "", ""],
    details: ["", "", ""],
    ingredients: [
      {
        name: "",
        contents: [
          ["", ""],
          ["", ""],
          ["", ""],
        ],
      },
    ],
    steps: [["", ""]],
  };

  //steps: { uuid: file, uuid: file, .. }
  let initialFiles = {
    main: "",
    steps: {},
    stepIdArr: [],
  };

  const [InputData, setInputData] = useState(
    modifyMode ? { ...myRecipeData } : { ...emptyData }
  );

  const [Files, setFiles] = useState(initialFiles);
  const [BeforeDelete, setBeforeDelete] = useState([]);

  const mainImgRef = useRef(null);

  const handleClickFile = () => mainImgRef.current.click();

  const encodeFileToBase64 = (fileBlob, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        callback(reader.result);
        resolve();
      };
    });
  };

  const handleChangeFile = (e) => {
    if (modifyMode) {
      let mainKey = InputData?.mainSrc;
      if (mainKey && mainKey.startsWith(FileFirst)) {
        setBeforeDelete((prev) => [mainKey, ...prev]);
      }
    }

    let file = e.target.files[0];
    setFiles((prev) => ({ ...prev, main: file }));

    let updateImgSrc = (imgSrc = "") =>
      setInputData((prev) => {
        return { ...prev, mainSrc: imgSrc };
      });

    encodeFileToBase64(file, updateImgSrc);
  };

  const handleInputChange = (e, idx = null) => {
    setInputData((prev) => {
      if (idx !== null) {
        let name = e.target.name;
        let temp = prev[name].slice();
        temp.splice(idx, 1, e.target.value);
        return { ...prev, [name]: temp };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  };

  //확인용(나중에 삭제)
  useEffect(() => {
    console.log("InputData: ", InputData);
  }, [InputData]);

  return (
    <Container>
      <h1>레시피 등록</h1>
      <InputBox>
        <IntroContainer
          mainSrc={
            InputData.mainSrc.startsWith(FileFirst)
              ? `${bucketUrl}${InputData.mainSrc}`
              : InputData.mainSrc
          }
        >
          <ul id="input_info">
            <li>
              <h2>레시피 제목</h2>
              <input
                type="text"
                name="title"
                placeholder="예) 매콤 달달 부산 떡볶이 만들기"
                defaultValue={InputData.title}
                onChange={handleInputChange}
              />
            </li>
            <li>
              <h2>요리 간단소개</h2>
              <textarea
                name="intro"
                defaultValue={InputData.intro}
                onChange={handleInputChange}
              />
            </li>
            <li>
              <h2>카테고리</h2>
              {dataKeys1.map((prop, idx) => (
                <select
                  key={idx}
                  name="category"
                  defaultValue={InputData.category[idx]}
                  onChange={(e) => handleInputChange(e, idx)}
                >
                  {data[prop].map((item, idx) => (
                    <option value={item} key={idx}>
                      {item}
                    </option>
                  ))}
                </select>
              ))}
            </li>
            <li>
              <h2>요리정보</h2>
              {dataKeys2.map((prop, idx) => (
                <select
                  key={idx}
                  name="details"
                  defaultValue={InputData.details[idx]}
                  onChange={(e) => handleInputChange(e, idx)}
                >
                  {data[prop].map((item, idx) => (
                    <option value={item} key={idx}>
                      {item}
                    </option>
                  ))}
                </select>
              ))}
            </li>
          </ul>
          <div id="upload_file">
            <div className="main_img" onClick={handleClickFile}>
              <span className="icon">
                <FontAwesomeIcon icon={faBowlFood} />
              </span>
              <span className="desc">음식 대표 사진 넣기</span>
            </div>
            <input
              ref={mainImgRef}
              type="file"
              accept="image/jpg, image/png, image/jpeg"
              onChange={handleChangeFile}
            />
          </div>
        </IntroContainer>
        <IngredientContainer>
          <IngredientInputBox
            modifyMode={modifyMode}
            InputData={InputData}
            setInputData={setInputData}
          />
        </IngredientContainer>
        <OrderContainer>
          <OrderInputBox
            modifyMode={modifyMode}
            InputData={InputData}
            setInputData={setInputData}
            setFiles={setFiles}
            setBeforeDelete={setBeforeDelete}
            encodeFile={encodeFileToBase64}
            FileFirst={FileFirst}
          />
        </OrderContainer>
        <BtnContainer>
          <RegisterBtn
            modifyMode={modifyMode}
            InputData={InputData}
            Files={Files}
            setInputData={setInputData}
            BeforeDelete={BeforeDelete}
            setBeforeDelete={setBeforeDelete}
          />
        </BtnContainer>
      </InputBox>
    </Container>
  );
}

export default RegisterRecipePage;
