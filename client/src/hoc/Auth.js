import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSetAuth } from "../contexts/AuthContext";

export default function (SpecificComponent, option = null) {
  function Auth() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const setAuth = useSetAuth();
    const [UserData, setUserData] = useState("");

    const authData = useQuery(
      "auth",
      async () => {
        let {
          token,
          userInfo: { external_type },
        } = UserData;

        let response = await axios
          .get(
            `${process.env.REACT_APP_OUR_SERVER_URI}/auth?type=${external_type}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => res.data);

        setAuth(response?.isAuth);

        queryClient.setQueryData("login", (oldData) => {
          let token = response?.access_token;
          if (token) return { ...oldData, token };
          return oldData;
        });

        return response;
      },
      { enabled: !!UserData?.isLogin, refetchOnWindowFocus: false }
    );

    useEffect(() => {
      const loginData = queryClient.getQueryData();
      if (option) {
        //로그인 한 상태
        if (loginData?.isLogin) {
          setUserData({ ...loginData });
          // auth api 거쳐야 함.
        } else {
          //로그인 안 한 상태
          let check = window.confirm(
            "로그인 후 이용이 가능합니다. 로그인을 하시겠습니까?"
          );

          if (check) {
            return navigate("/user/login", { state: location.pathname });
          } else {
            return navigate(-1);
          }
        }
      } else {
        if (loginData?.isLogin) setUserData({ ...loginData });
      }
    }, []);

    return <SpecificComponent />;
  }
  return Auth;
}
