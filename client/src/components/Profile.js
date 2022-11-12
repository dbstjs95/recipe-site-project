import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import profileImg from "../assets/profile_bg.jpg";
import { user_info as data } from "../mockData/user_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import UserInfoModal from "./UserInfoModal";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";
import userImg from "../assets/logo_img/user.png";
import { bucketUrl, fileUpload, fileDelete } from "../api/fileUpload";

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
        cursor: pointer;
        margin-top: 8px;
        font-size: 14px;
        em {
          text-decoration: underline;
          margin-left: 5px;
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
  const queryClient = useQueryClient();
  const [IsOpen, setIsOpen] = useState(false);
  const loginData = queryClient.getQueryData("login");

  //https://kyounghwan01.github.io/blog/React/react-query/basic/#usemutation
  //https://jforj.tistory.com/244
  const userInfoMutation = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_OUR_SERVER_URI}/user/change`, data),
    {
      onMutate: (variable) => {},
      onError: (error, variable, context) => {
        // error
      },
      onSuccess: (data, variables, context) => {
        console.log("success", data, variables, context);
        queryClient.setQueryData("login", (data) => {
          let userInfo = data?.userInfo;
          userInfo = { ...userInfo, ...variables };
          return { ...data, userInfo };
        });
        setIsOpen(false);
      },
      onSettled: () => {},
    }
  );

  const handleChangePhoto = async (e) => {
    let prevImg = loginData?.userInfo?.profile_img;

    if (prevImg) {
      let list = [{ Key: prevImg }];
      let isDeleted = await fileDelete(list);

      console.log("isDeleted?.response: ", isDeleted?.response);
      if (isDeleted?.response?.error) {
        return alert("기존 파일 삭제 에러 발생");
      }
    }

    let fileName = await fileUpload(
      e.target.files[0],
      `upload/user/${loginData?.userInfo?.id}/`
    );

    if (fileName) {
      userInfoMutation.mutate({ profile_img: fileName });
    } else {
      alert("프로필 이미지 변경에 실패했습니다.");
    }
  };

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
      {IsOpen && (
        <UserInfoModal
          setIsOpen={setIsOpen}
          value={loginData?.userInfo?.profile_desc || ""}
          userInfoMutation={userInfoMutation}
        />
      )}
      <div className="container">
        <Outlet />
      </div>
      <ProfileBox>
        <div>
          <BackgroundImg
            bgSrc={profileImg}
            userSrc={
              loginData?.userInfo?.profile_img
                ? `${bucketUrl}${loginData?.userInfo?.profile_img}`
                : userImg
            }
          >
            <label htmlFor="file"></label>
            <input type="file" id="file" onChange={handleChangePhoto} />
          </BackgroundImg>
          <p className="nickname">{loginData?.userInfo?.nickname}</p>
          <p
            className="write"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            {!loginData?.userInfo?.profile_desc ? (
              <>
                <FontAwesomeIcon icon={faPen} />
                <em>자기소개를 등록하세요.</em>
              </>
            ) : (
              loginData?.userInfo?.profile_desc
            )}
          </p>
        </div>
      </ProfileBox>
    </Container>
  );
}

export default Profile;
