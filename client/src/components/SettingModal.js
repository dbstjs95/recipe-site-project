import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

function SettingModal({ isLogin }) {
  return (
    <>
      {isLogin ? (
        <MenuModal className="modal">
          <li>
            <Link to="/mypage/recipe">나의 레시피</Link>
          </li>
          <li>
            <Link to="/register/recipe">레시피 등록</Link>
          </li>
          <li>
            <Link>좋아요 리스트</Link>
          </li>
          <li>
            <Link>구매한 클래스</Link>
          </li>
          <li>
            <Link to="/user/update">회원정보 수정</Link>
          </li>
          <li>
            <Link>로그아웃</Link>
          </li>
        </MenuModal>
      ) : (
        <MenuModal className="modal">
          <li>
            <Link to="/user/login">로그인/회원가입</Link>
          </li>
        </MenuModal>
      )}
    </>
  );
}

export default SettingModal;
