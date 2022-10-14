import React from "react";
import styled from "styled-components";
import { foodImgs } from "../mockData/food_icon";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ClassifySection = styled.section`
  /* padding: 10px; */
  position: relative;
  /* > span {
    position: absolute;
    top: 5%;
    right: 1.5%;
  } */
  ul {
    /* display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; */
    margin: 5px 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, auto));
    grid-gap: 5px;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 8px;
      img {
        width: 50px;
        height: 50px;
      }
      span {
        font-size: 13px;
        white-space: nowrap;
      }
    }
    /* @media screen and (max-width: 1760px) {
      justify-content: start;
    } */
  }
`;

function ClassifyBox({ children }) {
  return (
    <ClassifySection>
      {/* <span><FontAwesomeIcon icon={faChevronDown} /></span> */}
      {children}
      <ul>
        {foodImgs.map((img, idx) => (
          <li key={idx}>
            <img src={img.src} alt={img.name} />
            <span>{img.name}</span>
          </li>
        ))}
      </ul>
    </ClassifySection>
  );
}

export default ClassifyBox;
