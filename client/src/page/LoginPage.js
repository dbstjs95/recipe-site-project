import { useState, useEffect } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import google from "../assets/oauth_site_logo/google.png";
import naver from "../assets/oauth_site_logo/naver.png";

const ENV = process.env;

function LoginPage() {
  // axios.defaults.withCredentials = true;

  const [GoogleTokens, setGoogleTokens] = useState({
    access_token: "",
    id_token: "",
  });

  const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=code&redirect_uri=${ENV.REACT_APP_OUR_CLIENT_URI}&client_id=${ENV.REACT_APP_GOOGLE_CLIENT_ID}`;

  const naverOAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${ENV.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${ENV.REACT_APP_OUR_CLIENT_URI}&state=${ENV.REACT_APP_NAVER_STATE}`;

  const oAuthHandler = (url) => {
    window.location.assign(url);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    const authorizationState = url.searchParams.get("state");

    if (!authorizationCode) return;

    if (authorizationState) {
      //네이버
      axios
        .post(`${ENV.REACT_APP_OUR_SERVER_URI}/naver`, {
          code: authorizationCode,
          state: authorizationState,
        })
        .then((res) => {
          console.log("서버로부터 온 네이버 토큰", res.data);
        });
    } else {
      //구글
      const accessTokenRequestBody = {
        code: authorizationCode,
        client_id: ENV.REACT_APP_GOOGLE_CLIENT_ID,
        client_secret: ENV.REACT_APP_GOOGLE_CLIENT_SECRET,
        redirect_uri: ENV.REACT_APP_OUR_CLIENT_URI,
        grant_type: "authorization_code",
      };

      axios
        .post("https://oauth2.googleapis.com/token", accessTokenRequestBody)
        .then((result) => {
          const { access_token, id_token } = result.data;

          if (access_token) {
            setGoogleTokens({
              access_token,
              id_token,
            });

            return id_token;
          }
        })
        .then((id_token) => {
          axios
            .post(`${ENV.REACT_APP_OUR_SERVER_URI}/auth`, {
              id_token,
            })
            .then((res) => {
              console.log("서버로부터 온 구글 유저 정보", res.data);
            });
        });
    }
  }, []);

  return (
    <Background>
      <Container>
        <h1>로그인 / 회원가입</h1>
        <div>
          {/* <button id="google" onClick={() => oAuthHandler(googleOAuthURL)}> */}
          <button id="google">
            <img src={google} alt="구글 아이콘" />
            <p>구글로 간편 시작</p>
          </button>
          {/* <button id="naver" onClick={() => oAuthHandler(naverOAuthURL)}> */}
          <button id="naver">
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
