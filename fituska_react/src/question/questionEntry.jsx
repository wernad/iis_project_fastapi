import React from "react";
import { Link } from "react-router-dom";

const QuestionEntry = ({ id, name, category, date, is_open }) => {
  const path = `../questions/${id}`;
  const formatedDate = new Date(date);

  if (!name) return <div />;
  return (
    <>
      <div className="card col-md-6 my-1 mx-auto p-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <div style={{ width: "75px" }}>
              {is_open ? <span>[Open]</span> : <span>[Closed]</span>}
            </div>
            <Link to={path}>
              <div>{name}</div>
            </Link>
            <div>{category}</div>
          </div>
          <div className="mx-1">Dátum: {formatedDate.toLocaleDateString()}</div>
        </div>

        <div>{category}</div>
      </div>
    </>
  );
};

export default QuestionEntry;
