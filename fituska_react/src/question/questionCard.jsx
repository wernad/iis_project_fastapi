import React, { Component } from "react";

class QuestionCard extends Component {
  render() {
    return (
      <div className="card text-black bg-info mb-3 col-md-5">
        <div className="card-body">
          <h5 className="card-title">Informační systémy</h5>
          <p className="card-text">Vedúci: Jan Kucera</p>
        </div>
      </div>
    );
  }
}

export default QuestionCard;
