import React, { useState } from "react";

const AddReactionEntry = ({
  loggedUser,
  teachers,
  students,
  question_open,
  addReaction,
}) => {
  const [reactionText, setReactionText] = useState("");
  function updateReactionText(e) {
    setReactionText(e.target.value);
  }
  function checkIfCanReact() {
    if (!loggedUser) {
      return false;
    }

    if (!question_open) {
      return false;
    }

    if (teachers.includes(loggedUser)) {
      return false;
    }

    if (!students.includes(loggedUser)) {
      return false;
    }

    return true;
  }

  return (
    <>
      {checkIfCanReact() && (
        <div className="">
          <form onSubmit={(e) => addReaction(e)}>
            <div className="form-group">
              <label htmlFor="reactionText">Text reakcie:*</label>
              <textarea
                id="reactionText"
                name="reactionText"
                className="my-1 form-control"
                type="text"
                rows="2"
                onChange={(reaction) => updateReactionText(reaction)}
              />
            </div>
            <div className="form-group">
              <button
                disabled={reactionText.trim().length > 0 ? false : true}
                className="btn btn-primary form-control"
                type="submit"
              >
                Reagovať
              </button>
              {reactionText.trim().length > 0 ? (
                ""
              ) : (
                <span className="h6 text-danger">
                  *Text odpovede nesmie byť prázdny.
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddReactionEntry;
