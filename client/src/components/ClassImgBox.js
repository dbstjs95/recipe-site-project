import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUserGroup,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { colors } from "../css";
import { bucketUrl } from "../api/fileUpload";

const Container = styled.div``;

const MainImg = styled.div`
  background: ${({ main }) => `url(${main}) no-repeat center center`};
  background-size: cover;
  width: 100%;
  height: 0px;
  padding-bottom: 60%;
`;

const IntroBox = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid lightgray;
  h1 {
    font-size: 30px;
    word-break: break-all;
    @media screen and (max-width: 1024px) {
      font-size: 28px;
    }
  }
  pre.desc {
    color: #898c8a;
    font-size: 17px;
    white-space: pre-line;
    margin: 15px 0;
  }
  p.price {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #525150;
    em {
      color: black;
      font-size: 2em;
      margin-right: 2px;
    }
  }
  @media screen and (max-width: 700px) {
    h1 {
      font-size: 26px;
    }
    p.price {
      em {
        font-size: 1.8em;
      }
    }
  }
  @media screen and (max-width: 600px) {
    pre.desc {
      font-size: 15px;
    }
  }
  @media screen and (max-width: 500px) {
    h1 {
      font-size: 23px;
    }
    p.price {
      em {
        font-size: 1.6em;
      }
    }
  }
  @media screen and (max-width: 500px) {
    h1 {
      font-size: 20px;
    }
    pre.desc {
      font-size: 14px;
    }
    p.price {
      em {
        font-size: 1.5em;
      }
    }
  }
`;

const DetailBox = styled.ul`
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 20px 0 30px;
  li {
    display: flex;
    color: #989c99;
    align-items: center;
    letter-spacing: 1px;
    font-size: 1.1em;
    span {
      font-size: 1.5rem;
      margin-right: 5px;
    }
    em {
      color: #777;
      font-weight: bold;
    }
    @media screen and (max-width: 600px) {
      font-size: 0.9em;
    }
    @media screen and (max-width: 480px) {
      font-size: 0.8em;
    }
  }
`;

const RegisterBtn = styled.button`
  width: 100%;
  background-color: ${colors.main};
  border: 0;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  padding: 15px 0;
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 480px) {
    font-size: 1.2em;
    padding: 13px 0;
  }
  &:hover {
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.3);
  }
`;

function ClassImgBox({ data, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMovePay = () => {
    if (!user?.token) {
      let confirm = window.confirm(
        "로그인 후 이용 가능합니다. 로그인을 하시겠습니까?"
      );
      if (!confirm) return;
      let current = location.pathname + location?.search;
      localStorage.setItem("beforeLogin", current);
      return navigate("/user/login");
    }

    if (data?.isPurchased) return alert("이미 구매한 클래스입니다.");

    return navigate("pay", { state: { use: "pay" } });
  };

  let price = Number(data?.price).toLocaleString();
  return (
    <Container>
      <MainImg main={`${bucketUrl}${data?.header_img}`}></MainImg>
      <IntroBox>
        <h1>{data?.header_title}</h1>
        <pre className="desc">{data?.header_desc}</pre>
        <p className="price">
          <em>{price}</em>원
        </p>
      </IntroBox>
      <DetailBox>
        <li>
          <span>
            <FontAwesomeIcon icon={faClock} />
          </span>
          {data?.time_required}분
        </li>
        <li>
          <span>
            <FontAwesomeIcon icon={faCalendarDay} />
          </span>
          {data?.date}
        </li>
        <li>
          <span>
            <FontAwesomeIcon icon={faUserGroup} />
          </span>
          <em>{data?.sales}</em>명 신청
        </li>
      </DetailBox>
      <RegisterBtn onClick={handleMovePay}>{price}원 신청</RegisterBtn>
    </Container>
  );
}

export default ClassImgBox;
