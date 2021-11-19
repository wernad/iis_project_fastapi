import React, { Component } from "react";

import Navigation from "../forum/navbar";

const Top = ({ loggedUser }) => {
  return (
    <>
      <Navigation loggedUser={loggedUser} />
      <div className="text-center">
        <h1>Rebríček užívateľov</h1>
      </div>
      <div className="container"></div>
    </>
  );
};

export default Top;
