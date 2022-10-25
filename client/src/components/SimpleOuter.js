import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SimpleNav from "./SimpleNav";

const EntireContainer = styled.div`
  background-color: mintcream;
  min-height: 100vh;
  padding-bottom: 50px;
`;

function SimpleOuter() {
  return (
    <EntireContainer>
      <SimpleNav />
      {/* <EntireContainer> */}
      <Outlet />
      {/* </EntireContainer> */}
    </EntireContainer>
  );
}

export default SimpleOuter;
