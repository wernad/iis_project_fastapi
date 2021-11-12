import React, { Component } from "react";

class Login extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Prihlásenie</h1>
        <form>
          <label>
            E-mail:
            <input type="text" name="email" />
          </label>
          <label>
            Heslo:
            <input type="password" name="password" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Login;
