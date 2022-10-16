import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import styled from "styled-components";

const Container = styled.div`
  background-color: whitesmoke;
  padding: 20px 0;
`;

function App() {
  return (
    <>
      <NavBar />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export default App;
