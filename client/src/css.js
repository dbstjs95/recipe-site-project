import styled, { css } from "styled-components";

export const colors = {
  main: "#549949",
};

export const LayoutSize = css`
  width: 80vw;
  @media screen and (max-width: 1024px) {
    width: 90vw;
  }
  @media screen and (max-width: 580px) {
    width: 100vw;
  }
`;

export const ContainerStyle = css`
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;
`;
