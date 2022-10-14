import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import SettingModal from "./SettingModal";

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
  const [IsOpen, setIsOpen] = useState(false);
  const [IsLogin, setIsLogin] = useState(false);

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

  return (
    <Container>
      <li>
        {IsLogin ? (
          <StyledSpan onClick={handleClick} active={IsOpen}>
            <FontAwesomeIcon icon={faCircleUser} />
            {IsOpen && <SettingModal isLogin={true} />}
          </StyledSpan>
        ) : (
          <Link to="/user/login" className="userIcon">
            <FontAwesomeIcon icon={faUserCircle} />
          </Link>
        )}
      </li>
      <li>
        <Link to="register/recipe">
          <FontAwesomeIcon icon={faPenToSquare} />
        </Link>
      </li>
    </Container>
  );
}

export default UserMenu;
