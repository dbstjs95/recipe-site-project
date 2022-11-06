import axios from "axios";
import React, { Suspense, ErrorBoundary } from "react";
import { useQueryClient, useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetAuth } from "../contexts/AuthContext";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setAuth = useSetAuth();
    const location = useLocation();

    const { isLoading, isError, data, error } = useQuery(
      "auth",
      async () => {
        const userData = queryClient.getQueryData("login");
        console.log("userData: ", userData);
        if (userData?.isLogin) {
          // 로그인 된 상태
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

          if (option === false) {
            //로그인 안 한 상태만 들어갈 수 있음.
            navigate("/");
          }
          return response;
        } else {
          //로그인 안 된 상태
          if (option) {
            // 로그인 필수.
            let check = window.confirm(
              "로그인 후 이용이 가능합니다. 로그인을 하시겠습니까?"
            );
            if (check) {
              return navigate("/user/login", { state: location.pathname });
            } else {
              return navigate(-1);
            }
          } else if (option === null) {
            // 로그인 안 해도 됨.
            return localStorage.setItem("path", "");
          }

          //로그인 안 한 상태만 들어갈 수 있음.
          return "실행함";
        }
      },
      { refetchOnWindowFocus: false }
    );

    console.log("isLoading: ", isLoading, data);

    if (isLoading) {
      return <span>Loading...</span>;
    }

    if (isError) {
      return <span>Error: {error.message}</span>;
    }

    return (
      // <Suspense fallback={<div>loading</div>}>
      // {/* <ErrorBoundary fallback={<div>에러 발생</div>}> */}
      <SpecificComponent />
      // {/* </ErrorBoundary> */}
      // </Suspense>
    );
  }
  return AuthenticationCheck;
}
