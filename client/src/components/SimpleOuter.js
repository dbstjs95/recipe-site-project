import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SimpleNav from "./SimpleNav";
import { AuthProvider } from "../contexts/AuthContext";

const EntireContainer = styled.div`
  background-color: mintcream;
  min-height: 100vh;
  padding-bottom: 50px;
`;

function SimpleOuter() {
  return (
    <AuthProvider defaultValue={false}>
      <EntireContainer>
        <SimpleNav />
        {/* <EntireContainer> */}
        <Outlet />
        {/* </EntireContainer> */}
      </EntireContainer>
    </AuthProvider>
  );
}

export default SimpleOuter;
