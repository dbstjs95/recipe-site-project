import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import profileImg from "../assets/profile_bg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import UserInfoModal from "./UserInfoModal";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";
import userImg from "../assets/logo_img/user.png";
import { bucketUrl, fileUpload, fileDelete } from "../api/fileUpload";
import { useSetAuth } from "../contexts/AuthContext";

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

function Profile({ setHeader }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const user = queryClient.getQueryData("login");

  const PROFILE_IMG_FIRST = "upload/user/";

  const [ProfileImg, setProfileImg] = useState("");
  const [IsOpen, setIsOpen] = useState(false);

  //https://kyounghwan01.github.io/blog/React/react-query/basic/#usemutation
  //https://jforj.tistory.com/244

  const { mutate, isLoading } = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_OUR_SERVER_URI}/user/change`,
        data,
        setHeader(user?.token, user?.authType)
      ),
    {
      // onMutate: (variable) => {},
      onError: (error, variable, context) => {
        console.error(error);
        let result = error?.response?.data;
        alert(result?.message || "에러가 발생했습니다.");
        if (!result?.authInfo?.isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          return navigate("/user/login");
        }
      },
      onSuccess: (data, variables, context) => {
        let result = data?.data;
        if (user && result?.authInfo) {
          let { isAuth, newToken } = result?.authInfo;
          if (isAuth) {
            queryClient.setQueryData("login", (prev) => {
              let token = newToken || prev?.token;
              let userInfo = prev?.userInfo;
              if (result?.status === 200) {
                userInfo = { ...userInfo, ...variables };
              }
              return { ...prev, userInfo, token };
            });
          }
        }
        setIsOpen(false);
      },
      // onSettled: () => {},
    }
  );

  const handleChangePhoto = async (e) => {
    let prevImg = user?.userInfo?.profile_img;

    if (prevImg) {
      let list = [{ Key: prevImg }];
      let isDeleted = await fileDelete(list);

      if (isDeleted?.response?.error) {
        return alert("기존 파일 삭제 에러 발생");
      }
    }

    let fileName = await fileUpload(
      e.target.files[0],
      `upload/user/${user?.userInfo?.id}/`
    );

    if (fileName) {
      mutate({ profile_img: fileName });
    } else {
      alert("프로필 이미지 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!IsOpen) return;
    if (isLoading) return;
    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [IsOpen]);

  useEffect(() => {
    let imgSrc = user?.userInfo?.profile_img;
    if (!imgSrc) {
      setProfileImg(userImg);
    } else {
      if (imgSrc.startsWith(PROFILE_IMG_FIRST)) {
        setProfileImg(bucketUrl + imgSrc);
      } else {
        setProfileImg(imgSrc);
      }
    }
  }, [user]);

  return (
    <Container>
      {IsOpen && (
        <UserInfoModal
          setIsOpen={setIsOpen}
          value={user?.userInfo?.profile_desc || ""}
          mutate={mutate}
          isLoading={isLoading}
        />
      )}
      <div className="container">
        <Outlet context={{ setHeader, user }} />
      </div>
      <ProfileBox>
        <div>
          <BackgroundImg bgSrc={profileImg} userSrc={ProfileImg}>
            <label htmlFor="file"></label>
            <input type="file" id="file" onChange={handleChangePhoto} />
          </BackgroundImg>
          <p className="nickname">{user?.userInfo?.nickname}</p>
          <p
            className="write"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            {!user?.userInfo?.profile_desc ? (
              <>
                <FontAwesomeIcon icon={faPen} />
                <em>자기소개를 등록하세요.</em>
              </>
            ) : (
              user?.userInfo?.profile_desc
            )}
          </p>
        </div>
      </ProfileBox>
    </Container>
  );
}

export default Profile;
