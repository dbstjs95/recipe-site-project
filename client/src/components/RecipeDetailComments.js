import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { H2Style } from "./RecipeDetailIngr";
import { colors } from "../css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useSetAuth } from "../contexts/AuthContext";
import { Error, Loading } from "./States";
import { useChangeUrl } from "../api/changeUrl";

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

function RecipeDetailComments({
  ID,
  use = "recipe",
  user,
  setHeader,
  handleCmtCnt,
}) {
  const textRef = useRef();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const changeUrl = useChangeUrl();

  const [Count, setCount] = useState(0);
  const [CommentList, setCommentList] = useState([]);
  const [ShowNum, setShowNum] = useState(3);
  const [PagingInfo, setPagingInfo] = useState({
    targetId: null,
    limit: 3,
  });

  const { isLoading, isError, isFetching } = useQuery(
    [`getComment_${use}`, PagingInfo, ID],
    async ({ queryKey }) => {
      let { targetId, limit } = queryKey[1];
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/${use}/${ID}/comment?targetId=${targetId}&limit=${limit}`
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        if (targetId === null) {
          let cnt = result?.comments?.count;
          setCount(cnt);
          if (handleCmtCnt) {
            handleCmtCnt(cnt);
          }
        }

        setCommentList((prev) =>
          targetId === null
            ? [...result?.comments?.rows]
            : [...prev, ...result?.comments?.rows]
        );
        return result.comments;
      }
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const { mutate, isLoading: cmtIsLoading } = useMutation(
    (data) => {
      if (data?.api === "delete") {
        return axios
          .delete(
            `${process.env.REACT_APP_OUR_SERVER_URI}/${use}/${ID}/comment/${data?.value}`,
            setHeader(user?.token, user?.authType)
          )
          .then((res) => res.data);
      } else if (data?.api === "add") {
        return axios
          .post(
            `${process.env.REACT_APP_OUR_SERVER_URI}/${use}/${ID}/comment`,
            data?.value,
            setHeader(user?.token, user?.authType)
          )
          .then((res) => res.data);
      }
    },
    {
      onSuccess: async (data) => {
        if (data?.status === 200) {
          // textRef.current.value = "";
          let isUsed = queryClient.getQueryData([
            `getComment_${use}`,
            { targetId: null, limit: ShowNum },
            ID,
          ]);
          if (isUsed) {
            await queryClient.invalidateQueries([
              `getComment_${use}`,
              { targetId: null, limit: ShowNum },
              ID,
            ]);
          } else {
            setPagingInfo({ targetId: null, limit: ShowNum });
          }
        }
      },
      onError: (error) => {
        console.error(error);
        let result = error?.response?.data;
        alert(result?.message);
      },
      onSettled: (data, error) => {
        let result = data || error?.response?.data;
        if (result?.authInfo) {
          let { isAuth, newToken } = result?.authInfo;
          if (!isAuth) {
            setAuth((prev) => false);
            queryClient.removeQueries("login");
            alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          } else if (isAuth && newToken) {
            queryClient.setQueryData("login", (prev) => {
              return { ...prev, token: newToken };
            });
          }
        }
      },
    }
  );

  const handleClickMore = useCallback(() => {
    if (CommentList?.length > ShowNum) {
      setShowNum((prev) => prev + 10);
    } else {
      let targetId = CommentList[ShowNum - 1]?.id;
      setPagingInfo({ targetId, limit: 10 });
      setShowNum((prev) => prev + 10);
    }
  }, [CommentList, ShowNum, setPagingInfo, setShowNum]);

  const handleClickShorten = useCallback(() => {
    setShowNum(3);
  }, []);

  const handleDelete = useCallback((id) => {
    let confirm = window.confirm("댓글을 삭제하겠습니까?");
    if (confirm) {
      mutate({ api: "delete", value: id });
    }
    return;
  }, []);

  const handleClickAdd = useCallback(
    (e) => {
      e.preventDefault();
      let content = textRef.current.value;
      if (!user?.token) return alert("댓글작성은 로그인 후 이용이 가능합니다.");
      if (!content) {
        return alert("댓글을 입력해주세요.");
      }
      mutate({ api: "add", value: { content } });
    },
    [queryClient]
  );

  if (isFetching || cmtIsLoading)
    return <Loading height="30vh" type="comment" />;
  if (isError) return <Error height="30vh" imgSize="200px" fontSize="25px" />;

  return (
    <Container>
      <h2>
        댓글 <em>{Count}</em>
      </h2>
      <CommentsBox>
        {CommentList.slice(0, ShowNum).map((item) => {
          let profileImg = item?.writer?.profile_img;

          return (
            <li key={item?.id}>
              <img src={changeUrl(profileImg)} alt="프로필 이미지" />
              <ContentBox>
                <p className="head">
                  <span className="nickname">{item?.writer?.nickname}</span>
                  <span className="date">
                    <em>{item?.createdAt}</em>
                  </span>
                  {item?.writer?.id === user?.userInfo?.id && (
                    <span
                      className="delete"
                      onClick={() => handleDelete(item?.id)}
                    >
                      삭제
                    </span>
                  )}
                </p>
                <p className="body">{item?.content}</p>
              </ContentBox>
            </li>
          );
        })}
        {Count > 0 &&
          (CommentList.slice(0, ShowNum).length < Count ? (
            <MoreBtn onClick={handleClickMore}>더 보기</MoreBtn>
          ) : (
            CommentList.slice(0, ShowNum).length > 3 && (
              <ShortenBtn onClick={handleClickShorten}>줄여보기</ShortenBtn>
            )
          ))}
      </CommentsBox>
      <CommentInputBox>
        <textarea defaultValue="" ref={textRef} />
        <button onClick={handleClickAdd}>등록</button>
      </CommentInputBox>
    </Container>
  );
}

export default RecipeDetailComments;
