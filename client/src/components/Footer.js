import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logoImg from "../assets/logo_img/footer_logo.png";

const Container = styled.footer`
  font-size: 13px;
  border-top: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  overflow: auto;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    @media screen and (max-width: 1024px) {
      flex-direction: column;
    }
  }

  img {
    width: 150px;
  }

  address {
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 30px 20px;
  }
`;

const SiteInfo = styled.ul`
  display: flex;
  li {
    padding: 0 5px;
    &:not(:last-child) {
      border-right: 1px solid lightgray;
    }
    a:hover {
      color: gray;
    }
  }
  @media screen and (max-width: 1024px) {
    margin: 20px 0;
  }
`;

function Footer() {
  return (
    <Container>
      <div>
        <img src={logoImg} />
        <SiteInfo>
          <li>
            <Link href="#">사이트소개</Link>
          </li>
          <li>
            <Link href="#">광고문의</Link>
          </li>
          <li>
            <Link href="#">개인정보취급방침</Link>
          </li>
          <li>
            <Link href="#">고객센터</Link>
          </li>
          <li>
            <Link href="#">이용약관</Link>
          </li>
        </SiteInfo>

        <ul className="developer-info">
          <li>프론트 개발자: 최윤선 | &lt;yunseon95@gmail.com&gt; </li>
          <li>백엔트 개발자: 홍현희 | &lt;a1guskn7@gmail.com&gt;</li>
        </ul>
      </div>

      <address>Copyright&copy;오늘의레시피 All Right Reserved</address>
    </Container>
  );
}

export default Footer;
