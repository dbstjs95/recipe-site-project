import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { bucketUrl } from "../api/fileUpload";
import userImg from "../assets/logo_img/user.png";
import { Fetching } from "./States";

const BestSection = styled.section`
  position: relative;
  ul {
    width: 95%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, auto));
    justify-items: center;
    grid-column-gap: 5px;
    li {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 230px;
      padding: 0 5px 5px 5px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      margin-bottom: 2rem;
      cursor: pointer;
      span.order {
        position: absolute;
        top: -3px;
        left: -3px;
        background-color: white;
        font-size: 1.3rem;
        width: 2em;
        height: 2em;
        text-align: center;
        line-height: 2em;
        border: 1px solid #cfcfcf;
        border-radius: 5px;
        z-index: 1000;
      }
      p.title {
        width: 100%;
        padding-top: 5px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        /* white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; */
      }
      p.user {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        color: #787775;
        padding: 7px 0 5px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span {
          margin-left: 5px;
        }
      }
    }
  }
`;

// const ImgBox = styled.div`
//   width: 230px;
//   height: 200px;
//   background: ${({ imgSrc }) => `url(${imgSrc}) no-repeat center center`};
//   background-size: cover;
//   border-radius: 5px 5px 0 0;
//   /* transition: background-size 0.5s;
//   &:hover {
//     background-size: 110%;
//   } */
// `;

const ImgBox = styled.div`
  width: 230px;
  height: 200px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    transition: transform 0.5s;
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const DetailStyle = styled.p`
  display: flex;
  width: 100%;
  justify-content: ${({ best }) => (best ? `flex-end` : `space-between`)};
  padding: 0 5px 3px 0;
  span {
    font-size: 13px;
    color: #a8a8a8;
    &.like {
      display: ${({ best }) => best && `none`};
      em {
        color: #f05663;
      }
    }
  }
`;

function RecipeListBox({ children, data, use, isFetching }) {
  const navigate = useNavigate();
  const handleMovePage = (id) => navigate(`/recipes/${id}`);

  return (
    <BestSection>
      {isFetching && (
        <Fetching position="absolute" color="lightgray" bgColor="" />
      )}
      {children}
      <ul>
        {data.map((item, idx) => {
          const { recipe_id, src, title, userInfo, view, like } = item;
          let simpleView = (Number(view) / 10000).toFixed(1);

          // 테스트용
          let mainImg = "";
          if (src && src.startsWith("https://")) {
            mainImg = src;
          } else if (src) {
            mainImg = `${bucketUrl}${src}`;
          }

          return (
            <li key={idx} onClick={() => handleMovePage(recipe_id)}>
              {use === "best" && <span className="order">{idx + 1}</span>}
              <ImgBox>
                <img src={mainImg} alt="메인 이미지" />
              </ImgBox>
              <p className="title">{title}</p>
              <p className="user">
                <img
                  src={userInfo[0] ? `${bucketUrl}${userInfo[0]}` : userImg}
                />
                <span>{userInfo[1]}</span>
              </p>
              <DetailStyle best={use === "best"}>
                <span className="like">
                  <em>&hearts;</em> {like}
                </span>
                {/* <span className="view">조회수 {simpleView}만</span> */}
                <span className="view">조회수 {view}</span>
              </DetailStyle>
            </li>
          );
        })}
      </ul>
    </BestSection>
  );
}

export default RecipeListBox;
