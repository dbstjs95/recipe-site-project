import React from "react";
import styled from "styled-components";
import { colors } from "../css";
import logoImg from "../assets/logo_img/footer_logo.png";
import { Link } from "react-router-dom";

const Container = styled.div`
  background-color: white;
  border-top: 15px double ${colors.main};
  border-bottom: 15px double ${colors.main};
  padding: 5px 0;
  text-align: center;
  img {
    width: 200px;
    @media screen and (max-width: 600px) {
      width: 150px;
    }
    @media screen and (max-width: 480px) {
      width: 130px;
    }
  }
`;

function SimpleNav() {
  return (
    <Container>
      <Link to="/">
        <img src={logoImg} alt="로고 이미지" />
      </Link>
    </Container>
  );
}

export default SimpleNav;
