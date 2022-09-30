import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ENV = process.env;

function App() {
  const [Tokens, setTokens] = useState({
    access_token: "",
    id_token: "",
  });

  const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=code&redirect_uri=${ENV.REACT_APP_REDIRECT_URI}&client_id=${ENV.REACT_APP_CLIENT_ID}`;

  const naverOAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${ENV.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${ENV.REACT_APP_REDIRECT_URI}&state=${ENV.REACT_APP_NAVER_STATE}`;

  const oAuthHandler = (url) => {
    window.location.assign(url);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    const authorizationState = url.searchParams.get("state");

    //check
    console.log(
      "authorizationCode: ",
      authorizationCode,
      "/ authorizationState: ",
      authorizationState
    );

    if (authorizationCode && authorizationState) {
      console.log("naver");
      const accessTokenRequestBody = {
        grant_type: "authorization_code",
        client_id: ENV.REACT_APP_NAVER_CLIENT_ID,
        client_secret: ENV.REACT_APP_NAVER_CLIENT_SECRET,
        code: authorizationCode,
        redirect_uri: encodeURI(ENV.REACT_APP_REDIRECT_URI),
        state: authorizationState,
      };

      let redirectUrl = encodeURI(ENV.REACT_APP_REDIRECT_URI);

      axios
        .get(
          `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${ENV.REACT_APP_NAVER_CLIENT_ID}&client_secret=${ENV.REACT_APP_NAVER_CLIENT_SECRET}&redirect_uri=${ENV.REACT_APP_REDIRECT_URI}&code=${authorizationCode}&state=${authorizationState}`,
          {
            headers: {
              "X-Naver-Client-Id": ENV.REACT_APP_NAVER_CLIENT_ID,
              "X-Naver-Client-Secret": ENV.REACT_APP_NAVER_CLIENT_SECRET,
            },
          }
        )
        // .post("https://nid.naver.com/oauth2.0/token", accessTokenRequestBody)
        .then((res) => {
          console.log(res.data);
        });
    } else if (authorizationCode) {
      const accessTokenRequestBody = {
        code: authorizationCode,
        client_id: ENV.REACT_APP_CLIENT_ID,
        client_secret: ENV.REACT_APP_CLIENT_SECRET,
        redirect_uri: ENV.REACT_APP_REDIRECT_URI,
        grant_type: "authorization_code",
      };

      axios
        .post("https://oauth2.googleapis.com/token", accessTokenRequestBody)
        .then((result) => {
          const { access_token, id_token } = result.data;

          console.log("access_token", access_token, "id_token", id_token);

          if (access_token) {
            setTokens({
              access_token,
              id_token,
            });

            return id_token;
          }
        })
        .then((id_token) => {
          axios
            .post(`${ENV.REACT_APP_SERVER_URI}/auth`, {
              id_token,
            })
            .then((res) => {
              console.log(res.data);
            });
        });
    }
  }, []);

  return (
    <div className="App">
      <button id="oAuthBtn" onClick={() => oAuthHandler(googleOAuthURL)}>
        <div id="comment">구글 OAuth</div>
      </button>
      <button id="oAuthBtn" onClick={() => oAuthHandler(naverOAuthURL)}>
        <div id="comment">네이버 OAuth</div>
      </button>
    </div>
  );
}

export default App;
