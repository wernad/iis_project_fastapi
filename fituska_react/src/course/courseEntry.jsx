import React from "react";
import { Link } from "react-router-dom";

const CourseEntry = ({ id, name }) => {
  const path = `./${id}`;

  if (!name) return <div />;
  return (
    <>
      <div className="card col-md-5 my-1 mx-auto">
        <p className="mx-auto">
          <Link to={path}> {name}</Link>
        </p>
      </div>
    </>
  );
};

export default CourseEntry;
