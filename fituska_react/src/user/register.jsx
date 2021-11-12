import React, { Component } from "react";

class Register extends React.Component {
  state = { checked: false };

  handleCheckbox = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    const student_info = this.state.checked ? (
      <div>
        <label>
          Ročník:
          <input type="number" min="1" value="1" />
        </label>
        <label>
          Program:
          <select name="program">
            <option value="BIT">Bakalársky</option>
            <option value="MIT">Magisterský</option>
            <option value="DIT">Doktorandský</option>
          </select>
        </label>
      </div>
    ) : null;

    return (
      <div>
        <h1>Registrácia</h1>
        <form>
          <label>
            Meno:
            <input type="text" name="name" />
          </label>
          <label>
            Priezvisko:
            <input type="text" name="surname" />
          </label>
          <label>
            E-mail:
            <input type="text" name="username" />
          </label>
          <label>
            Heslo:
            <input type="password" name="password" />
          </label>
          <label>
            Som študent:
            <input
              type="checkbox"
              defaultChecked={this.state.checked}
              onChange={this.handleCheckbox}
              name="student_status"
            />
          </label>
          {student_info}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Register;
