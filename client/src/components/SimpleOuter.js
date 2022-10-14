import React from "react";
import { Outlet } from "react-router-dom";
import SimpleNav from "./SimpleNav";

function SimpleOuter() {
  return (
    <>
      <SimpleNav />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default SimpleOuter;
