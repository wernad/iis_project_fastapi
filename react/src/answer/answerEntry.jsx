import React, { useState } from "react";
import Cookies from "universal-cookie";

import ReactionEntry from "../reaction/reactionEntry";
import AddReactionEntry from "../reaction/addReactionEntry";

const AnswerEntry = ({
  id,
  loggedUser,
  user_id,
  teachers,
  students,
  description,
  date,
  user,
  is_correct,
  reactions,
  upvotes,
  totalUpvotes,
  question_open,
  showCloseQuestion,
  hostname
}) => {
  const [upvoteCount, setUpvoteCount] = useState(upvotes.length);
  const [upvotedByUser, setUpvotedByUser] = useState(false);
  const formatedDate = new Date(date).toLocaleString();
  const cookies = new Cookies();
  const access_token = cookies.get("access_token");
  const name = user.first_name + " " + user.last_name;

  const upvoteIcon = "▲";

  const addReaction = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
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
        hostname + "addreaction",
        requestOptions
      );

      const data = await response.json();

      let new_reactions = reactions.slice();
      new_reactions.push(data);
      reactions = new_reactions;
    } catch (e) {
      console.log("error:" + e);
    }
  };

  async function addUpvote() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        answer_id: id,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        hostname + "addupvote",
        requestOptions
      );

      const data = await response.json();

      let new_upvotes = upvotes.slice();
      new_upvotes.push(data);
      upvotes = new_upvotes.slice();
      setUpvoteCount(upvoteCount + 1);
      setUpvotedByUser(true);
    } catch (e) {
      console.log("error:" + e);
    }
  }

  function showUpvoteButton() {
    if (!question_open) {
      return false;
    }

    if (!loggedUser) {
      return false;
    }

    if (teachers.includes(loggedUser)) {
      return false;
    }

    if (!students.includes(loggedUser)) {
      return false;
    }
    if (loggedUser === user_id) {
      return false;
    }

    const totalUpvotesByUser = totalUpvotes.filter((upvoteUserId) => {
      if (upvoteUserId === loggedUser) {
        return loggedUser;
      }
      return null;
    });

    if (totalUpvotesByUser.length > 2 && !alreadyUpvoted()) {
      return false;
    }

    return true;
  }

  function alreadyUpvoted() {
    let upvotesByUser = upvotes
      .filter((upvote) => {
        if (upvote.user_id === loggedUser) {
          return upvote;
        }
        return null;
      })
      .map((upvote) => {
        return upvote.answer_id;
      });

    if (upvotesByUser.length > 0) {
      return true;
    }
  }

  function setAnswerBorder() {
    if (is_correct) {
      return "border-success";
    }

    if (teachers.includes(user_id)) {
      return "border-warning";
    }

    return "border-info";
  }

  function setAnswerBackground() {
    if (is_correct) {
      return "bg-success";
    }

    if (teachers.includes(user_id)) {
      return "bg-warning";
    }

    return "bg-info";
  }

  return (
    <>
      <div
        className={`card my-2 ${
          is_correct ? "border-success" : setAnswerBorder()
        }`}
      >
        <div
          className={`d-flex flex-row ${
            is_correct ? "bg-success" : setAnswerBackground()
          }`}
        >
          <div className="mx-1">
            Od:
            <span className="mx-1">
              {name}
              {teachers.includes(user_id) && " (Učiteľ)"}
            </span>
            <br />
            Dátum: {formatedDate}
          </div>

          <div className="h2 flex-fill text-end m-1">
            {!teachers.includes(user_id) && upvoteCount}
          </div>
          {(loggedUser || question_open) && (
            <div role="button" className="h2 m-1">
              {showUpvoteButton() && (
                <button
                  disabled={alreadyUpvoted() || upvotedByUser ? true : false}
                  className="btn btn-secondary"
                  onClick={() => addUpvote()}
                >
                  {upvoteIcon}
                </button>
              )}
            </div>
          )}
        </div>
        <div>{description}</div>
      </div>
      <div className="container">
        {!showCloseQuestion &&
          reactions &&
          reactions.map((reaction, key) => {
            return (
              <div key={key}>
                <ReactionEntry
                  key={key}
                  id={reaction.id}
                  description={reaction.description}
                  date={reaction.date}
                  user={reaction.user}
                  hostname={hostname}
                />
              </div>
            );
          })}
        <AddReactionEntry
          loggedUser={loggedUser}
          totalUpvotes={totalUpvotes}
          teachers={teachers}
          students={students}
          question_open={question_open}
          addReaction={addReaction}
          hostname={hostname}
        />
      </div>
    </>
  );
};

export default AnswerEntry;
