import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import SettingModal from "./SettingModal";
import { colors } from "../css";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.form`
  display: flex;
  align-items: center;
  width: 40%;
  min-width: 300px;
  height: 45px;
`;

const InPutBox = styled.input`
  width: 100%;
  height: 100%;
  padding: 10px;
  font-weight: bold;
  outline: none;
  border: 1px solid #48ad23;
  border-radius: 5px 0 0 5px;
  &::placeholder {
    color: #878787;
    font-size: 17px;
  }
`;

const SubmitBtn = styled.button`
  padding: 10.5px;
  color: #fff;
  cursor: pointer;
  background-color: ${colors.main};
  border-radius: 0 5px 5px 0;
  border: none;
  outline: none;
`;

const SettingIcon = styled.span`
  position: relative;
  display: none;
  margin-left: 15px;
  cursor: pointer;
  font-size: 1.5em;
  @media screen and (max-width: 780px) {
    display: inline-block;
  }
`;

function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchRef = useRef();

  const [IsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!IsOpen) return;

    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [IsOpen]);

  useEffect(() => {
    if (!pathname) return;
    if (pathname !== "/recipes") {
      searchRef.current.value = "";
    }
  }, [pathname]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setIsOpen((nextIsOpen) => !nextIsOpen);
    },
    [setIsOpen]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let keyword = searchRef.current.value;
      if (!keyword) return alert("검색어를 입력해주세요.");
      navigate(`/recipes?type=search&keyword=${keyword}`);
    },
    [searchRef]
  );

  return (
    <Container>
      <InPutBox ref={searchRef} type="text" placeholder="레시피 찾기" />
      <SubmitBtn type="submit" onClick={handleSubmit}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </SubmitBtn>
      <SettingIcon>
        <FontAwesomeIcon icon={faEllipsisVertical} onClick={handleClick} />
        {IsOpen && <SettingModal />}
      </SettingIcon>
    </Container>
  );
}

export default SearchBar;
