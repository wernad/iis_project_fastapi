import React, { useState } from "react";
import { Link } from "react-router-dom";

import ReactionEntry from "../reaction/reactionEntry";
import AddReactionEntry from "../reaction/addReactionEntry";

const AnswerEntry = ({
  id,
  loggedUser,
  teachers,
  students,
  description,
  date,
  user,
  is_correct,
  reactions,
  upvotes,
  question_open,
}) => {
  const [upvotesCount, setUpvotesCount] = useState(0);
  const formatedDate = new Date(date).toLocaleString();
  const name = user.first_name + " " + user.last_name;

  const upvoteIcon = "▲";

  function upvoteAnswer() {
    console.log("clicked");
  }

  const addReaction = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: new FormData(e.target).get("reactionText"),
        date: new Date().toISOString(),
        answer_id: id,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/addreaction",
        requestOptions
      );

      const data = await response.json();

      let new_reactions = reactions;
      new_reactions.append(data);
      reactions = new_reactions;
    } catch (e) {
      console.log("error:" + e);
    }
  };

  return (
    <>
      <div
        className={`card my-2 ${is_correct ? "border-success" : "border-info"}`}
      >
        <div
          className={`d-flex flex-row ${is_correct ? "bg-success" : "bg-info"}`}
        >
          <div className="mx-1">
            Od:
            <span className="mx-1">{name}</span>
            <br />
            Dátum: {formatedDate}
          </div>
          <div className="h2 flex-fill text-end m-1">{upvotes.length}</div>
          {(loggedUser || question_open) && (
            <div role="button" className="h2 m-1">
              <a className="btn btn-secondary" onClick={() => upvoteAnswer()}>
                {upvoteIcon}
              </a>
            </div>
          )}
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
        <AddReactionEntry
          loggedUser={loggedUser}
          teachers={teachers}
          students={students}
          question_open={question_open}
          addReaction={addReaction}
        />
      </div>
    </>
  );
};

export default AnswerEntry;
