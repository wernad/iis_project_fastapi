import React, { useState } from "react";

const AddAnswerEntry = ({
  loggedUser,
  teachers,
  students,
  question_author,
  question_open,
  answers_authors,
  addAnswer,
  hostname
}) => {
  const [answerText, setAnswerText] = useState("");
  function updateAnswerText(e) {
    setAnswerText(e.target.value);
  }
  function checkIfCanAnswer() {
    if (!loggedUser) {
      return false;
    }

    if (loggedUser === question_author) {
      return false;
    }

    if (!question_open) {
      return false;
    }

    if (answers_authors.includes(loggedUser)) {
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
      {checkIfCanAnswer() && (
        <div>
          <form onSubmit={(e) => addAnswer(e)}>
            <div className="form-group">
              <label htmlFor="answerText">Text odpovede:*</label>
              <textarea
                id="answerText"
                name="answerText"
                className="my-1 form-control"
                type="text"
                rows="4"
                onChange={(answer) => updateAnswerText(answer)}
              />
            </div>
            <div className="form-group">
              <button
                disabled={answerText.trim().length > 0 ? false : true}
                className="btn btn-primary form-control"
                type="submit"
              >
                Odpovedať
              </button>
              {answerText.trim().length > 0 ? (
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

export default AddAnswerEntry;
