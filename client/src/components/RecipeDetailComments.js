import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { H2Style } from "./RecipeDetailIngr";
import { colors } from "../css";

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px 15px;
  @media screen and (max-width: 1024px) {
    width: 90%;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
  }
  h2 {
    ${H2Style};
    em {
      color: ${colors.main};
    }
  }
`;

const CommentsBox = styled.ul`
  border: 1px solid lightgray;
  li {
    border-bottom: 1px solid lightgray;
    display: flex;
    align-items: center;
    padding: 15px 10px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      margin-right: 15px;
      align-self: flex-start;
    }
    @media screen and (max-width: 600px) {
      padding: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
`;

const ContentBox = styled.div`
  > p {
    &.head {
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      span {
        &.nickname {
          font-size: 18px;
          color: green;
        }
        &.date {
          margin: 0 10px;
        }
        &.delete {
          border-left: 1px solid lightgray;
          padding-left: 10px;
          cursor: pointer;
        }
        &.date,
        &.delete {
          font-size: 15px;
          color: #8a8888;
        }
      }
      @media screen and (max-width: 600px) {
        margin-bottom: 1px;
        span {
          &.nickname {
            font-size: 17px;
          }
          &.date,
          &.delete {
            font-size: 13px;
          }
        }
      }
      @media screen and (max-width: 300px) {
        span {
          &.date {
            display: none;
          }
          &.delete {
            border-left: 0;
          }
        }
      }
    }
    &.body {
      word-break: break-all;
      white-space: pre-line;
    }
    @media screen and (max-width: 400px) {
      &.head {
        span {
          &.nickname {
            font-size: 16px;
          }
          &.date {
            margin: 0 8px;
          }
          &.delete {
            padding-left: 8px;
          }
        }
      }
      &.body {
        font-size: 15px;
      }
    }
  }
`;

const MoreBtn = styled.div`
  background-color: white;
  width: 20%;
  margin: 20px auto;
  text-align: center;
  padding: 10px 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  @media screen and (max-width: 600px) {
    margin: 15px auto;
    padding: 5px 0;
  }
`;

const ShortenBtn = styled(MoreBtn)``;

const CommentInputBox = styled.form`
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  textarea {
    width: 70%;
    height: 100px;
    resize: none;
    border: 2px solid lightgray;
    border-radius: 5px 0 0 5px;
    padding: 10px;
  }
  button {
    outline: none;
    border: 2px solid lightgray;
    border-left: none;
    padding: 0 30px;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
  }
  @media screen and (max-width: 480px) {
    textarea {
      width: 80%;
    }
    button {
      font-size: 15px;
      padding: 0 18px;
    }
  }
`;

function RecipeDetailComments({ data }) {
  const myUserId = 51;
  const [CommentList, setCommentList] = useState([]);
  const [ShowNum, setShowNum] = useState(3);

  const showComments = () => {
    let temp = [...data.contents].slice(0, Number(ShowNum));
    setCommentList(temp);
  };

  useEffect(() => {
    showComments();
  }, [ShowNum]);

  const handleClickMore = () => {
    setShowNum((prev) => prev + 10);
  };

  const handleClickShorten = () => {
    setShowNum(3);
  };

  return (
    <Container>
      <h2>
        댓글 <em>{data.num}</em>
      </h2>
      <CommentsBox>
        {CommentList.map((item) => {
          return (
            <li key={item[0]}>
              <img src={item[1]} alt="프로필 이미지" />
              <ContentBox>
                <p className="head">
                  <span className="nickname">{item[2]}</span>
                  <span className="date">
                    <em>{item[3]}</em>
                  </span>
                  {item[0] === myUserId && <span className="delete">삭제</span>}
                </p>
                <p className="body">{item[4]}</p>
              </ContentBox>
            </li>
          );
        })}
        {data.num > 0 &&
          (CommentList.length >= data.num ? (
            <ShortenBtn onClick={handleClickShorten}>줄여보기</ShortenBtn>
          ) : (
            <MoreBtn onClick={handleClickMore}>더 보기</MoreBtn>
          ))}
      </CommentsBox>
      <CommentInputBox>
        <textarea />
        <button onClick={(e) => e.preventDefault()}>등록</button>
      </CommentInputBox>
    </Container>
  );
}

export default RecipeDetailComments;
