import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetAuth } from "../contexts/AuthContext";

export default function (SpecificComponent, option = null) {
  function Auth() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const setAuth = useSetAuth();
    const loginData = queryClient.getQueryData("login");

    const setHeader = (token, type) => {
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          AuthType: type,
        },
        withCredentials: true,
      };
    };

    useEffect(() => {
      if (loginData?.token) {
        setAuth((prev) => true);
      }

      // 회원전용페이지
      if (option) {
        //로그인 안 한 상태
        if (!loginData?.token) {
          let check = window.confirm(
            "로그인 후 이용이 가능합니다. 로그인을 하시겠습니까?"
          );

          if (check) {
            let current = location.pathname;
            localStorage.setItem("beforeLogin", current);
            return navigate("/user/login");
          } else {
            return navigate(-1);
          }
        }
      } else if (option === false) {
        // 로그인 상태라면 들어갈 수 없음(예: 로그인 페이지)
        if (loginData?.token) return navigate(-1);
        // 작동이 안 됨.. 아마 로그인 페이지 들어가자마자 기존 로그인 데이터가 사라지면서 위의 조건을 만족하지 않게 되기 때문인 듯...
      }
    }, []);

    return <SpecificComponent setHeader={setHeader} />;
  }
  return Auth;
}
