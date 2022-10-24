import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import profileImg from "../assets/profile_bg.jpg";
import { user_info as data } from "../mockData/user_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import UserInfoModal from "./UserInfoModal";

/* 화면 너비 0 ~ 1220px */
/* 화면 너비 0 ~ 1024px */
/* 화면 너비 0 ~ 960px */
/* 화면 너비 0 ~ 768px */
/* 화면 너비 0 ~ 600px */
/* 화면 너비 0 ~ 480px */
/* 화면 너비 0 ~ 320px */

const Container = styled.div`
  width: 80%;
  min-height: 50vh;
  display: flex;
  margin: 0 auto;
  @media screen and (max-width: 1220px) {
    width: 90%;
  }
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
  > div.container {
    background-color: white;
    flex: 1;
  }
`;
const ProfileBox = styled.div`
  padding-left: 10px;
  @media screen and (max-width: 960px) {
    display: none;
  }
  > div {
    width: 300px;
    min-height: 290px;
    background-color: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    input[type="file"] {
      display: none;
    }
    > p {
      text-align: center;
      &.nickname {
        font-weight: bold;
      }
      &.write {
        text-decoration: underline;
        margin-top: 8px;
        font-size: 14px;
        em {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
`;

const BackgroundImg = styled.div`
  width: 100%;
  height: 145px;
  background: ${({ bgSrc }) => `url(${bgSrc}) no-repeat top center`};
  background-size: cover;
  position: relative;
  margin-bottom: 70px;
  label {
    display: block;
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transform: translate(-50%, 50%);
    left: 50%;
    bottom: 0;
    background: ${({ userSrc }) => `url(${userSrc}) no-repeat top center`};
    background-size: cover;
    outline: 4px solid rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }
`;

function Profile() {
  const [IsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!IsOpen) return;

    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [IsOpen]);

  return (
    <Container>
      {IsOpen && <UserInfoModal handleClick={setIsOpen} />}
      <div className="container">
        <Outlet />
      </div>
      <ProfileBox>
        <div>
          <BackgroundImg bgSrc={profileImg} userSrc={data.img}>
            <label htmlFor="file"></label>
            <input
              type="file"
              id="file"
              onClick={(e) => {
                e.preventDefault();
                console.log("click!!");
              }}
            />
          </BackgroundImg>
          <p className="nickname">{data.nickname}</p>
          <p className="write">
            {data.desc === "" ? (
              <>
                <FontAwesomeIcon icon={faPen} />
                <em
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                >
                  자기소개를 등록하세요.
                </em>
              </>
            ) : (
              data.desc
            )}
          </p>
        </div>
      </ProfileBox>
    </Container>
  );
}

export default Profile;
