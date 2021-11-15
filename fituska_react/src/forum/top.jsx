import React, { Component } from "react";

import Navigation from "../forum/navbar";

class Top extends Component {
  render() {
    return (
      <>
        <Navigation />
        <div className="text-center">
          <h1>Rebríček užívateľov</h1>
        </div>
        <div className="container"></div>
      </>
    );
  }
}

export default Top;
