import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import SettingModal from "./SettingModal";

const Container = styled.ul`
  display: flex;
  align-items: center;

  li.userIcon {
    position: relative;
    ul.modal {
      top: 60px;
      width: 140px;
      li {
        padding: 10px;
        a {
          font-size: 16px;
          font-weight: bold;
          color: #535754;
          margin-right: 0;
        }
      }
    }
  }

  a,
  span {
    font-size: 2.5em;
    &:hover {
      color: #424347;
    }
    @media screen and (max-width: 960px) {
      font-size: 2em;
    }
  }

  a {
    color: #8d8e94;
  }

  @media screen and (max-width: 780px) {
    display: none;
  }
`;

const StyledSpan = styled.span`
  color: ${({ active }) => (active ? `#424347` : `#8d8e94`)};
  margin-right: 0.5em;
  @media screen and (max-width: 960px) {
    margin-right: 0.3em;
  }
`;

function UserMenu() {
  const [IsOpen, setIsOpen] = useState(false);

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
      <li className="userIcon" onClick={handleClick}>
        <StyledSpan active={IsOpen}>
          <FontAwesomeIcon icon={faUserCircle} />
        </StyledSpan>
        {IsOpen && <SettingModal isLogin={false} />}
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
