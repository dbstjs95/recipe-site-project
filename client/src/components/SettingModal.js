import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth, useSetAuth } from "../contexts/AuthContext";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

const MenuModal = styled.ul`
  position: absolute;
  top: 45px;
  right: 0px;
  background-color: #fff;
  border: 1px solid #ebebeb;
  box-shadow: 5px 5px 10px 0 rgb(0 0 0 / 5%);
  border-radius: 5px 0 5px 5px;
  /* width: 120px; */
  z-index: 1;
  li {
    padding: 10px;
    &:not(:last-child) {
      border-bottom: 1px solid rgb(0 0 0 / 5%);
    }
    &:hover {
      box-shadow: inset 0 0 50px rgb(0 0 0 / 5%);
    }
    a {
      display: block;
      font-size: 13px;
      text-align: center;
      color: #222;
      white-space: nowrap;
      /* &:focus,
      &:hover,
      &:visited,
      &:link,
      &:active {
        text-decoration: none;
        color: #222;
      } */
    }
  }
`;

function SettingModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const IsAuth = useAuth();
  const setAuth = useSetAuth();

  const user = queryClient.getQueryData("login");

  const handleGoLogin = () => {
    let current = location.pathname + location?.search;
    localStorage.setItem("beforeLogin", current);
    navigate("/user/login");
  };

  const { mutate } = useMutation(
    () =>
      axios.post(
        `${process.env.REACT_APP_OUR_SERVER_URI}/user/logout`,
        {},
        {
          headers: {
            Authorization: user?.token ? `Bearer ${user?.token}` : "",
            AuthType: user?.authType,
          },
          withCredentials: true,
        }
      ),
    {
      onSuccess: (data) => {
        let result = data?.data;
        if (result?.status === 200) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          return navigate("/");
        }
      },
      onError: (error) => {
        console.error(error);
        let result = error?.response?.data;
        alert(result?.message);
        if (!result?.authInfo?.isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          return navigate("/");
        }
      },
    }
  );

  const handleLogout = () => {
    let confirm = window.confirm("로그아웃 하시겠습니까?");
    if (!confirm) return;
    mutate();
  };

  return (
    <>
      {IsAuth ? (
        <MenuModal className="modal">
          <li>
            <Link to="/mypage/recipe?type=public">나의 레시피</Link>
          </li>
          <li>
            <Link to="/mypage/like">좋아요 리스트</Link>
          </li>
          <li>
            <Link to="/mypage/class">구매한 클래스</Link>
          </li>
          <li>
            <Link to="/user/update">회원정보수정</Link>
          </li>
          <li onClick={handleLogout}>
            <Link>로그아웃</Link>
          </li>
        </MenuModal>
      ) : (
        <MenuModal className="modal">
          <li>
            <a onClick={handleGoLogin}>로그인/회원가입</a>
          </li>
        </MenuModal>
      )}
    </>
  );
}

export default SettingModal;
