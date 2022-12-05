import React, { useState } from "react";
import styled from "styled-components";
import { user_info as data } from "../mockData/user_data";
import { useMutation, useQueryClient } from "react-query";
import { useSetAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 600px;
  margin: 50px auto 0;
  text-align: center;
  padding: 0 20px;
  h1 {
    margin-bottom: 20px;
    font-size: 1.8em;
    font-weight: bold;
  }
  ul {
    border: 1px solid lightgray;
    background-color: white;
    li {
      &:not(:last-child) {
        border-bottom: 1px solid lightgray;
      }
      > div.modify {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        font-size: 17px;
        font-weight: bold;
        color: #4d4f4e;
        button {
          padding: 5px 8px;
          font-size: 16px;
          background-color: white;
          border: 1px solid lightgray;
          cursor: pointer;
        }
      }
      > div.submit {
        padding-bottom: 20px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        p#delete {
          font-size: 13px;
          margin-bottom: 5px;
          color: #4d4c4c;
          em {
            color: crimson;
          }
        }
        input {
          width: 100%;
          margin-bottom: 20px;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.05);
          border: 1px solid #ccc;
          outline: 0;
          &:focus {
            border: 1px solid #029ad6;
            box-shadow: 0 0 5px rgba(2, 154, 214, 1);
          }
        }
        button {
          background-color: #00a32c;
          border: 0;
          padding: 6px 20px;
          color: white;
          border-radius: 3px;
          &:hover {
            box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }
  @media screen and (max-width: 600px) {
    width: 100%;
    padding: 0 10px;
    h1 {
      font-size: 1.6em;
    }
    ul li {
      > div.modify {
        font-size: 16px;
        padding: 15px;
        button {
          font-size: 15px;
        }
      }
      > div.submit {
        input,
        button {
          font-size: 15px;
        }
        input {
          padding: 7px;
          width: 90%;
        }
        button {
          padding: 5px 15px;
        }
      }
    }
  }
  @media screen and (max-width: 400px) {
    padding: 0px;
    h1 {
      font-size: 1.4em;
    }
    ul li {
      > div.modify {
        font-size: 15px;
        padding: 10px;
        button {
          font-size: 14px;
          padding: 3px 5px;
        }
      }
      > div.submit {
        input,
        button {
          font-size: 14px;
        }
      }
    }
  }
  @media screen and (max-width: 350px) {
    h1 {
      font-size: 1.3em;
    }
    ul li {
      > div.submit {
        p#delete {
          font-size: 12px;
        }
      }
    }
  }
`;

function ModifyUserInfoPage({ setHeader }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const user = queryClient.getQueryData("login");
  const [IsOpen, setIsOpen] = useState({
    email: false,
    nickname: false,
    delete: false,
  });
  const [InputVal, setInputVal] = useState({
    email: "",
    nickname: "",
    delete: "",
  });

  const userInfoChange = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_OUR_SERVER_URI}/user`,
        data,
        setHeader(user?.token, user?.authType)
      ),
    {
      onSuccess: (data, val) => {
        let result = data?.data;
        if (user && result?.authInfo) {
          let { isAuth, newToken } = result?.authInfo;
          if (isAuth) {
            queryClient.setQueryData("login", (prev) => {
              let token = newToken || prev?.token;
              let userInfo = prev?.userInfo;
              if (result?.status === 200) {
                userInfo = { ...userInfo, ...val };
              }
              return { ...prev, userInfo, token };
            });
          }
        }
      },
      onError: (error, val) => {
        console.error(error);
        let result = error?.response?.data;
        alert(result?.message);
        if (!result?.authInfo?.isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          return navigate("/user/login");
        }
      },
    }
  );

  const userDelete = useMutation(
    () =>
      axios.delete(
        `${process.env.REACT_APP_OUR_SERVER_URI}/user`,
        setHeader(user?.token, user?.authType)
      ),
    {
      onSuccess: (data) => {
        let result = data?.data;
        if (result?.status === 200) {
          alert("회원탈퇴 되었습니다.");
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          return navigate("/");
        }
      },
      onError: (error) => {
        console.error(error);
        let result = error?.response?.data;
        alert(result?.message);
        if (!result?.authInfo?.isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          return navigate("/user/login");
        }
      },
    }
  );

  const handleClickModify = (type) =>
    setIsOpen((prev) => {
      return { ...prev, [type]: true };
    });

  const handleSubmit = (type) => {
    let value = InputVal?.[type];
    let data = { [type]: value };

    if (!value) return;

    if (type === "email") {
      let emailCheck =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailCheck.test(value)) {
        return alert("올바른 이메일 형식이 아닙니다.");
      }
      userInfoChange.mutate(data);
    } else if (type === "nickname") {
      let nicknameCheck = /[~!@#$%^&*()_+|<>?:{}]/;
      if (value.search(/\s/) !== -1 || nicknameCheck.test(value)) {
        return alert("닉네임에 띄어쓰기, 특수문자 사용은 불가합니다.");
      }
      userInfoChange.mutate(data);
    } else if (type === "delete") {
      if (value !== "회원탈퇴") return;
      userDelete.mutate();
    }
  };

  return (
    <Container>
      <h1>회원정보수정</h1>
      <ul>
        <li>
          <div className="modify">
            <span>{user?.userInfo?.email}</span>
            <button onClick={() => handleClickModify("email")}>
              이메일 수정
            </button>
          </div>
          {IsOpen.email && (
            <div className="submit">
              <input
                type="email"
                placeholder="이메일"
                defaultValue={InputVal?.email}
                onChange={(e) =>
                  setInputVal((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <button onClick={() => handleSubmit("email")}>변경</button>
            </div>
          )}
        </li>
        <li>
          <div className="modify">
            <span>{user?.userInfo?.nickname}</span>
            <button onClick={() => handleClickModify("nickname")}>
              닉네임 수정
            </button>
          </div>
          {IsOpen.nickname && (
            <div className="submit">
              <input
                type="text"
                placeholder="닉네임"
                defaultValue={InputVal?.nickname}
                onChange={(e) =>
                  setInputVal((prev) => ({ ...prev, nickname: e.target.value }))
                }
              />
              <button onClick={() => handleSubmit("nickname")}>변경</button>
            </div>
          )}
        </li>
        <li>
          <div className="modify">
            <span>회원탈퇴</span>
            <button onClick={() => handleClickModify("delete")}>
              탈퇴하기
            </button>
          </div>
          {IsOpen.delete && (
            <div className="submit">
              <p id="delete">
                정말 탈퇴를 원하신다면 <em>회원탈퇴</em>를 입력하세요.
              </p>
              <input
                type="text"
                placeholder="회원탈퇴"
                maxLength={4}
                defaultValue={InputVal?.delete}
                onChange={(e) =>
                  setInputVal((prev) => ({ ...prev, delete: e.target.value }))
                }
              />
              <button onClick={() => handleSubmit("delete")}>입력</button>
            </div>
          )}
        </li>
      </ul>
    </Container>
  );
}

export default ModifyUserInfoPage;
