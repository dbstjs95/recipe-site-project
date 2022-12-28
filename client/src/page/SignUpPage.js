import React, { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Fetching, Error } from "../components/States";

const Container = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 350px;
    > h1 {
      font-size: 2rem;
      color: #474745;
      font-weight: bold;
      text-align: center;
      @media screen and (max-width: 600px) {
        font-size: 1.9rem;
      }
    }
    > input {
      padding: 10px;
    }
    > p.message {
      color: crimson;
      padding: 5px;
      text-align: center;
      font-size: 0.9rem;
    }
    > button {
      border: 0;
      border-radius: 3px;
      padding: 10px 20px;
      font-size: 1.2rem;
      font-weight: bold;
      background-color: #06993a;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
        transform: scale(102%);
      }
    }
    @media screen and (max-width: 400px) {
      padding: 10px;
      width: 100%;
      > h1 {
        font-size: 1.8rem;
      }
    }
  }
`;

function SignUpPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  let nextPage = localStorage.getItem("beforeLogin");

  const loginData = queryClient.getQueryData("login");
  const [InputVal, setInputVal] = useState({
    ...loginData,
  });
  const [Msg, setMsg] = useState("");

  const { mutate, isLoading, isError } = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_OUR_SERVER_URI}/user/register`,
        data,
        { withCredentials: true }
      ),
    {
      onSuccess: (data) => {
        let result = data?.data;
        if (result?.status === 200) {
          queryClient.setQueryData("login", (prev) => {
            let token = prev?.token;
            return {
              ...result,
              token,
              authType: result?.userInfo?.external_type,
            };
          });
          alert("회원가입을 성공했습니다.");
          navigate(nextPage || "/");
          return localStorage.removeItem("beforeLogin");
        }
      },
      onError: (error) => {
        console.error(error);
        alert("회원가입에 실패했습니다.");
        navigate(nextPage || "/");
        return localStorage.removeItem("beforeLogin");
      },
      onSettled: () => {},
    }
  );

  const handleSubmit = () => {
    let emailCheck =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let nicknameCheck = /[~!@#$%^&*()_+|<>?:{}]/;

    let nickname = InputVal?.nickname;
    let email = InputVal?.email;

    if (!nickname) {
      return setMsg("닉네임을 입력해주세요.");
    }

    if (nickname.search(/\s/) !== -1 || nicknameCheck.test(nickname)) {
      return setMsg("닉네임에 띄어쓰기, 특수문자 사용은 불가합니다.");
    }

    if (!email || !emailCheck.test(email)) {
      return setMsg("올바른 이메일 형식이 아닙니다.");
    }

    mutate(InputVal);
    setMsg("");
  };

  if (isError) return <Error />;

  return (
    <>
      {isLoading && <Fetching type="rotate" />}
      <Container>
        <div>
          <h1>회원가입</h1>
          <input
            type="text"
            placeholder="닉네임"
            defaultValue={InputVal?.nickname}
            onChange={(e) =>
              setInputVal((prev) => ({ ...prev, nickname: e.target.value }))
            }
          />
          <input
            type="email"
            placeholder="example@email.com"
            defaultValue={InputVal?.email}
            onChange={(e) =>
              setInputVal((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <p className="message">{Msg}</p>
          <button onClick={handleSubmit}>회원가입</button>
        </div>
      </Container>
    </>
  );
}

export default SignUpPage;
