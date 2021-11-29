import React from "react";

const ReactionEntry = ({ date, description, user,hostname }) => {
  const formatedDate = new Date(date).toLocaleString();
  const name = user.first_name + " " + user.last_name;
  return (
    <>
      <div className="card my-2">
        <div className="bg-secondary">
          <div className="mx-1">
            Od:
            <span className="mx-1">{name}</span>
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
