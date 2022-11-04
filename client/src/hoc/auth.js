import axios from "axios";
import React, { Suspense, ErrorBoundary, useEffect } from "react";
import { useQueryClient, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth, useSetAuth } from "../contexts/AuthContext";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const Auth = useAuth();
    const setAuth = useSetAuth();

    const userData = queryClient.getQueryData("login");
    const authData = useQuery(
      "auth",
      async () => {
        if (!userData) return;
        if (userData?.isLogin) {
          let {
            token,
            userInfo: { external_type },
          } = userData;

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
        }
      },
      { refetchOnWindowFocus: false }
    );

    useEffect(() => {
      if (!authData?.data) return;
      let { data } = authData;

      if (!data?.isAuth) {
        // 강제 로그아웃 시키기?
        if (option) navigate("/user/login");
      } else {
        if (option === false) {
          navigate("/");
        }
      }
    }, []);

    return (
      // <Suspense fallback={<div>loading</div>}>
      // <ErrorBoundary fallback={<div>에러 발생</div>}>
      <SpecificComponent />
      // <SpecificComponent user={userData} />
      // </ErrorBoundary>
      // </Suspense>
    );
  }
  return AuthenticationCheck;
}
