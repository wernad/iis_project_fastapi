import React from "react";
import { Link } from "react-router-dom";

const ReactionEntry = ({ id, date, description, user }) => {
  const formatedDate = new Date(date).toLocaleString();
  const name = user.first_name + " " + user.last_name;
  return (
    <>
      <div className="card my-2">
        <div className="bg-secondary">
          <div className="mx-1">
            Od:
            <Link className="text-dark mx-1" to={"../users/" + id}>
              {name}
            </Link>
            <br />
            Dátum: {formatedDate}
          </div>
        </div>
        <div></div>
        <div>{description}</div>
      </div>
    </>
  );
};

export default ReactionEntry;
