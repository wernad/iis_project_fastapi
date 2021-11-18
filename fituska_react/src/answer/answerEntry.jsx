import React, { useState } from "react";
import { Link } from "react-router-dom";

import ReactionEntry from "../answer/reactionEntry";

const AnswerEntry = ({
  id,
  description,
  date,
  user,
  is_correct,
  reactions,
  upvotes,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(0);
  const formatedDate = new Date(date).toLocaleString();
  const name = user.first_name + " " + user.last_name;
  if (reactions) {
    console.log(reactions);
  }
  return (
    <>
      <div
        className={`card my-2 ${is_correct ? "border-success" : "border-info"}`}
      >
        <div className={`${is_correct ? "bg-success" : "bg-info"}`}>
          <div className="mx-1">
            Od:
            <Link className="text-dark mx-1" to={"../users/" + user.id}>
              {name}
            </Link>
            <br />
            Dátum: {formatedDate}
          </div>
        </div>
        <div>{description}</div>
      </div>
      <div className="container">
        {reactions &&
          reactions.map((reaction, key) => {
            return (
              <div key={key}>
                <ReactionEntry
                  key={key}
                  id={reaction.id}
                  description={reaction.description}
                  date={reaction.date}
                  user={reaction.user}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default AnswerEntry;
