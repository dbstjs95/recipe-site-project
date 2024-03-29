import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { css } from "styled-components";
import google from "../assets/oauth_site_logo/google.png";
import naver from "../assets/oauth_site_logo/naver.png";
import { useQuery } from "react-query";
import { Loading, Error } from "../components/States";

const ENV = process.env;

function LoginPage() {
  const navigate = useNavigate();

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
        .post(
          `${ENV.REACT_APP_OUR_SERVER_URI}/user/login/naver`,
          {
            code: authCode,
            state: authState,
          },
          { withCredentials: true }
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        return { ...result, authType: "naver", isLogin: true };
      } else if (result?.status === 202 && !result?.isRegistered) {
        navigate("/user/signup");
        return { userInfo: result?.userInfo, token: result?.token };
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
            headers: { Authorization: `Bearer ${id_token}` },
          }
        )
        .then((res) => res.data);

      if (result?.status === 200) {
        return {
          ...result,
          token: id_token,
          authType: "google",
          isLogin: true,
        };
      } else if (result?.status === 202 && !result?.isRegistered) {
        navigate("/user/signup");
        return { userInfo: result?.userInfo, token: { act: id_token } };
      }
      return null;
    }
  };

  const { isLoading, isError } = useQuery("login", clickLogin, {
    onSuccess: (data) => {
      if (data?.isLogin && data?.token) {
        let nextPage = localStorage.getItem("beforeLogin");
        if (nextPage) {
          navigate(nextPage);
          return localStorage.removeItem("beforeLogin");
        } else {
          return navigate("/");
        }
      }
    },
    onError: () => {
      alert("로그인 에러가 발생했습니다.");
      return navigate("/");
    },
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    // suspense: true,
  });

  if (isLoading) return <Loading type="dots" />;
  if (isError) return <Error />;

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
