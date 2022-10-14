import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import logoImg from "../assets/logo_img/logo3.png";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { colors } from "../css";

const Nav = styled.nav`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px;
    width: 85%;
    @media screen and (max-width: 1220px) {
      width: 100%;
    }
    @media screen and (max-width: 600px) {
      flex-direction: column;
      padding: 20px 0 30px 0;
      img {
        margin-bottom: 30px;
      }
      form {
        width: 300px;
      }
    }
  }
`;

const SubContainer = styled.div`
  background-color: ${colors.main};
  box-shadow: 5px 5px 10px 0 rgb(0, 0, 0, 30%);
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    margin: 0 auto;
    li {
      flex: 1;
      text-align: center;
      padding: 15px 10px;
      transition: 0.5s;
      &:hover {
        flex: 1.5;
        box-shadow: inset 0 0 100px rgb(0, 0, 0, 0.2);
      }
      a {
        color: #fff;
        font-weight: bold;
        font-size: 20px;
      }
    }
    @media screen and (max-width: 580px) {
      flex-direction: column;
      width: 100%;
      li {
        width: 100%;
        &:not(:last-child) {
          border-bottom: 1px solid rgb(0, 0, 0, 0.25);
        }
      }
    }
  }
`;

function NavBar() {
  return (
    <Nav>
      <MainContainer>
        <div>
          <Link to="/">
            <img style={{ width: "250px" }} src={logoImg} alt="로고 이미지" />
          </Link>
          <SearchBar />
          <UserMenu />
        </div>
      </MainContainer>

      <SubContainer>
        <ul>
          <li>
            <NavLink>메인</NavLink>
          </li>
          <li>
            <NavLink>분류</NavLink>
          </li>
          <li>
            <NavLink>클래스</NavLink>
          </li>
          <li>
            <NavLink>더보기</NavLink>
          </li>
        </ul>
      </SubContainer>
    </Nav>
  );
}

export default NavBar;
