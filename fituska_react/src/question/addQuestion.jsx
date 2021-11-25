import React, { useState } from "react";

const AddQuestion = ({
  toggleShow,
  showAddQuestion,
  addQuestion,
  categories,
}) => {
  const [questionText, setQuestionText] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");

  function updateQuestionText(e) {
    setQuestionText(e.target.value);
  }

  function updateQuestionTitle(e) {
    setQuestionTitle(e.target.value);
  }

  function updateQuestionCategory(e) {
    setQuestionCategory(e.target.value);
  }

  return (
    <>
      {showAddQuestion && (
        <>
          <div>
            <form onSubmit={(e) => addQuestion(e)} className="col-md-5 mx-auto">
              <div className="form-group">
                <select
                  name="questionCategory"
                  defaultValue=""
                  className="mx-auto text-center"
                  onChange={(e) => updateQuestionCategory(e)}
                >
                  <option value="" disabled={true}>
                    Vyberte kategóriu
                  </option>
                  {categories &&
                    categories.map((category, key) => {
                      return (
                        <option key={key} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                </select>
                {questionCategory.trim().length > 0 ? (
                  ""
                ) : (
                  <span className="h6 text-danger">
                    *Kategória otázky nesmie byť prázdna.
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="questionTitle">Text odpovede:*</label>
                <input
                  id="questionTitle"
                  name="questionTitle"
                  className="my-1 form-control"
                  type="text"
                  onChange={(answer) => updateQuestionTitle(answer)}
                />
              </div>
              {questionTitle.trim().length > 0 ? (
                ""
              ) : (
                <span className="h6 text-danger">
                  *Titul otázky nesmie byť prázdny.
                </span>
              )}
              <div className="form-group">
                <label htmlFor="questionText">Text odpovede:*</label>
                <textarea
                  id="questionText"
                  name="questionText"
                  className="my-1 form-control"
                  type="text"
                  rows="4"
                  onChange={(answer) => updateQuestionText(answer)}
                />
              </div>
              {questionText.trim().length > 0 ? (
                ""
              ) : (
                <span className="h6 text-danger">
                  *Text otázky nesmie byť prázdny.
                </span>
              )}
              <div className="form-group my-3 col-md-5 mx-auto">
                <button
                  disabled={
                    questionText.trim().length > 0 &&
                    questionTitle.trim().length > 0 &&
                    questionCategory.trim().length > 0
                      ? false
                      : true
                  }
                  className="btn btn-primary form-control my-1"
                  type="submit"
                >
                  Vytvoriť
                </button>
                <button
                  type="button"
                  className="btn btn-danger form-control my-1"
                  onClick={toggleShow}
                >
                  Zrušiť
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default AddQuestion;
