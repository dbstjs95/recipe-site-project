import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled, { css } from "styled-components";
import google from "../assets/oauth_site_logo/google.png";
import naver from "../assets/oauth_site_logo/naver.png";
import { useQuery } from "react-query";

const ENV = process.env;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  let savedPage = localStorage.getItem("path");

  const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=code&redirect_uri=${ENV.REACT_APP_CLIENT_REDIRECT_URI}&client_id=${ENV.REACT_APP_GOOGLE_CLIENT_ID}`;

  const naverOAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${ENV.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${ENV.REACT_APP_CLIENT_REDIRECT_URI}&state=${ENV.REACT_APP_NAVER_STATE}`;

  // 새로고침을 유발
  const oAuthHandler = (url) => {
    window.location.assign(url);
  };

  const clickLogin = async () => {
    const url = new URL(window.location.href);
    const authCode = url.searchParams.get("code");
    const authState = url.searchParams.get("state");

    if (!authCode) return;

    if (authState) {
      //네이버
      let result = await axios
        .post(`${ENV.REACT_APP_OUR_SERVER_URI}/user/login/naver`, {
          code: authCode,
          state: authState,
        })
        .then((res) => {
          if (res?.data?.message === "success") return res.data;
          return null;
        })
        .catch((err) => null);

      if (result) {
        return { ...result, isLogin: true };
      }
      return null;
    } else {
      //구글
      const accessTokenRequestBody = {
        code: authCode,
        client_id: ENV.REACT_APP_GOOGLE_CLIENT_ID,
        client_secret: ENV.REACT_APP_GOOGLE_CLIENT_SECRET,
        redirect_uri: ENV.REACT_APP_CLIENT_REDIRECT_URI,
        grant_type: "authorization_code",
      };

      let response = await axios.post(
        "https://oauth2.googleapis.com/token",
        accessTokenRequestBody
      );

      let { id_token } = response.data;

      if (!id_token) return;

      //헤더로...
      let result = await axios
        .post(
          `${ENV.REACT_APP_OUR_SERVER_URI}/user/login/google`,
          {},
          {
            headers: { authorization: `Bearer ${id_token}` },
          }
        )
        .then((res) => {
          if (res?.data?.message === "success") return res.data;
          return null;
        })
        .catch((err) => null);

      if (result) {
        //로그인 성공
        return { ...result, token: id_token, isLogin: true };
      }
      return null;
    }
  };

  const userData = useQuery("login", clickLogin, {
    refetchOnWindowFocus: false,
    // suspense: true,
  });

  useEffect(() => {
    let nextPage = location.state;
    if (nextPage) localStorage.setItem("path", nextPage);

    if (userData?.data?.isLogin) {
      if (savedPage) {
        navigate(savedPage);
        localStorage.removeItem("path");
      } else {
        navigate("/");
      }
    }
  });

  return (
    <Background>
      <Container>
        <h1>로그인 / 회원가입</h1>
        <div>
          <button id="google" onClick={() => oAuthHandler(googleOAuthURL)}>
            <img src={google} alt="구글 아이콘" />
            <p>구글로 간편 시작</p>
          </button>
          <button id="naver" onClick={() => oAuthHandler(naverOAuthURL)}>
            <img src={naver} alt="네이버 아이콘" />
            <p>네이버로 간편 시작</p>
          </button>
        </div>
      </Container>
    </Background>
  );
}

const FlexCommonStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: "Nanum Gothic", sans-serif;
`;

const Background = styled.div`
  padding-top: 80px;
  height: 100vh;
  background-color: #fbfcf5;
`;

const Container = styled.div`
  ${FlexCommonStyle}
  height: 270px;
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #126b1d;
  }
  > div {
    ${FlexCommonStyle}
    height: 160px;
    button {
      ${FlexCommonStyle}
      flex-direction: row;
      width: 260px;
      height: 65px;
      font-size: 1.2rem;
      padding: 0 7%;
      border-radius: 15px;
      font-weight: 700;
      background-color: #fff;
      border: 0;
      box-shadow: 0 0 5px gray;
      color: #515357;
      cursor: pointer;
      transition: color 0.1s, box-shadow 0.3s, transform 0.3s;
      &:hover {
        color: #40403e;
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.2);
        transform: scale(110%);
      }
      img {
        width: 40px;
      }
      p {
        flex: 1;
      }
      &#naver {
        img {
          width: 42px;
        }
      }
    }
  }

  @media screen and (max-width: 480px) {
    height: 220px;
    h1 {
      font-size: 1.7rem;
    }
    > div {
      height: 135px;
      button {
        width: 230px;
        height: 55px;
        font-size: 1.1rem;
        padding: 0 10px;
        img {
          width: 35px;
        }
        &#naver {
          img {
            width: 37px;
          }
        }
        &:hover {
          transform: scale(105%);
        }
      }
    }
  }
`;

export default LoginPage;
