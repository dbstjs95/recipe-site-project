import { useState, useEffect } from "react";
import axios from "axios";

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
    <div>
      <button id="oAuthBtn" onClick={() => oAuthHandler(googleOAuthURL)}>
        <div id="comment">구글 OAuth</div>
      </button>
      <button id="oAuthBtn" onClick={() => oAuthHandler(naverOAuthURL)}>
        <div id="comment">네이버 OAuth</div>
      </button>
    </div>
  );
}

export default LoginPage;
