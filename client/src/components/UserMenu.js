import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import SettingModal from "./SettingModal";
import { useQueryClient } from "react-query";
import { useAuth } from "../contexts/AuthContext";

const UserMenuIconStyle = css`
  font-size: 2.5em;
  color: #8d8e94;
  &:hover {
    color: #424347;
  }
  @media screen and (max-width: 960px) {
    font-size: 2em;
  }
`;

const Container = styled.ul`
  display: flex;
  align-items: center;

  a {
    ${UserMenuIconStyle}
    &.userIcon {
      margin-right: 0.5em;
    }
    @media screen and (max-width: 960px) {
      &.userIcon {
        margin-right: 0.3em;
      }
    }
  }

  @media screen and (max-width: 780px) {
    display: none;
  }
`;

const StyledSpan = styled.span`
  ${UserMenuIconStyle}
  position: relative;
  margin-right: 0.5em;
  color: ${({ active }) => (active ? `#424347` : `#8d8e94`)};
  @media screen and (max-width: 960px) {
    margin-right: 0.3em;
  }

  ul.modal {
    top: 60px;
    width: 140px;
    li {
      a {
        font-size: 16px;
        font-weight: bold;
        color: #535754;
        margin-right: 0;
      }
    }
  }
`;

function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const IsAuth = useAuth();

  const queryClient = useQueryClient();
  const loginData = queryClient.getQueryData("login");

  const [IsOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   console.log("IsLogin: ", IsLogin);
  //   const authData = queryClient.getQueryData("auth");
  //   if (!authData) return;
  //   setIsLogin(authData?.isAuth || false);
  // });

  useEffect(() => {
    if (!IsOpen) return;

    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [IsOpen]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((nextIsOpen) => !nextIsOpen);
  }, []);

  const handleGoPage = (dest) => {
    let current = location.pathname;
    if (dest === "login") {
      navigate("/user/login", { state: current });
    } else {
      navigate("/register/recipe");
    }
  };

  return (
    <Container>
      <li>
        {IsAuth ? (
          <StyledSpan onClick={handleClick} active={IsOpen}>
            <FontAwesomeIcon icon={faCircleUser} />
            {IsOpen && <SettingModal />}
          </StyledSpan>
        ) : (
          <a className="userIcon" onClick={() => handleGoPage("login")}>
            <FontAwesomeIcon icon={faUserCircle} />
          </a>
        )}
      </li>
      <li>
        <a onClick={() => handleGoPage("register")}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </a>
      </li>
    </Container>
  );
}

export default UserMenu;
