import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";

import AnswerEntry from "../answer/answerEntry";
import AddAnswerEntry from "../answer/addAnswerEntry";

const QuestionDetail = ({ loggedUser, hostname }) => {
  const [showCloseQuestion, setShowCloseQuestion] = useState(false);
  const [answersCheckboxes, setAnswersCheckboxes] = useState({});
  const [finalAnswerText, setFinalAnswerText] = useState("");
  const [statusCode, setStatusCode] = useState();
  const [author, setAuthor] = useState({});
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [totalUpvotes, setTotalUpvotes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  const cookies = new Cookies();
    const access_token = cookies.get("access_token");

  useEffect(() => {
    async function fetchQuestionData() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          hostname + "question/" + id,
          requestOptions
        );

        const data = await response.json();
        setStatusCode(response.status);
        setQuestion(data);
        setAuthor(data.user);
        setAnswers(data.answers);
        setAnswersCheckboxes(
          initCheckboxStates(
            data.answers.map((answer) => {
              return answer.id;
            })
          )
        );

        setTeachers(
          data.course.users
            .filter((user) => {
              if (user.is_teacher === true && user.is_approved === true) {
                return user;
              }
              return null;
            })
            .map((user) => {
              return user.user_id;
            })
        );

        setStudents(
          data.course.users
            .filter((user) => {
              if (user.is_teacher === false && user.is_approved === true) {
                return user;
              }
              return null;
            })
            .map((user) => {
              return user.user_id;
            })
        );

        setTotalUpvotes(
          data.answers
            .map((answer) => answer.upvotes)
            .flat()
            .map((upvote) => upvote.user_id)
        );

        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
        setStatusCode(e);
      }
    }
    fetchQuestionData();
  }, [id]);

  function initCheckboxStates(array) {
    let new_object = {};
    array.forEach((elem) => {
      new_object[elem] = { correct: false, upvoted: false };
    });

    return new_object;
  }

  const addAnswer = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        description: new FormData(e.target).get("answerText"),
        date: new Date().toISOString(),
        question_id: question.id,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        hostname + "addanswer",
        requestOptions
      );

      const data = await response.json();

      let new_answers = answers.slice();
      new_answers.push(data);
      setAnswers(new_answers);
    } catch (e) {
      console.log("error:" + e);
    }
  };

  const closeQuestion = async (e) => {
    const correct_answers = [];
    const upvoted_answers = [];

    for (const [key, value] of Object.entries(answersCheckboxes)) {
      if (value.correct) {
        correct_answers.push(key);
      }
      if (value.upvoted) {
        upvoted_answers.push(key);
      }
    }

    const final_answer = {
      date: new Date().toISOString(),
      description: new FormData(e.target).get("finalAnswerText"),
      user_id: loggedUser,
      question_id: question.id,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        correct_answers: correct_answers,
        upvoted_answers: upvoted_answers,
        final_answer: final_answer,
      }),
    };

    try {
      const response = await fetch(
        hostname + "closequestion",
        requestOptions
      );

      const data = await response.json();

      setQuestion({ ...question, is_open: false });
    } catch (e) {
      console.log("error:" + e);
    }
  };

  function toggleShow() {
    setShowCloseQuestion(!showCloseQuestion);
  }

  function canCloseQuestion() {
    if (!loggedUser) {
      return false;
    }

    if (!teachers.includes(loggedUser)) {
      return false;
    }

    if (!question.is_open) {
      return false;
    }

    return true;
  }

  function toggleCorrectCheckbox(answerId) {
    const new_state = {
      correct: !answersCheckboxes[answerId].correct,
      upvoted: answersCheckboxes[answerId].correct
        ? false
        : answersCheckboxes[answerId].upvoted,
    };
    setAnswersCheckboxes({
      ...answersCheckboxes,
      [answerId]: new_state,
    });
  }

  function toggleUpvoteCheckbox(answerId) {
    setAnswersCheckboxes({
      ...answersCheckboxes,
      [answerId]: {
        ...answersCheckboxes[answerId],
        upvoted: !answersCheckboxes[answerId].upvoted,
      },
    });
  }

  function updateFinalAnswerText(e) {
    setFinalAnswerText(e.target.value);
  }

  return (
    <>
      {loaded && question ? (
        <>
          <div className=" col-md-8 my-1 mx-auto p-1 ">
            {canCloseQuestion() && !showCloseQuestion && (
              <div className="text-center">
                <button className="btn btn-primary my-2" onClick={toggleShow}>
                  Uzatvoriť otázku
                </button>
              </div>
            )}
            {showCloseQuestion && (
              <>
                <form
                  onSubmit={(e) => closeQuestion(e)}
                  className="col-md-5 mx-auto"
                >
                  <div className="form-group">
                    <label htmlFor="finalAnswerText">
                      Text finálnej odpovede:*
                    </label>
                    <textarea
                      id="finalAnswerText"
                      name="finalAnswerText"
                      className="my-1 form-control"
                      type="text"
                      rows="4"
                      onChange={(answer) => updateFinalAnswerText(answer)}
                    />
                  </div>
                  {finalAnswerText.trim().length > 0 ? (
                    ""
                  ) : (
                    <span className="h6 text-danger">
                      *Text odpovede nesmie byť prázdny.
                    </span>
                  )}
                  <div>
                    <div className="form-group">
                      <button
                        className="btn btn-success my-2"
                        disabled={
                          finalAnswerText.trim().length > 0 ? false : true
                        }
                        type="submit"
                      >
                        Potvrdiť uzatvorenie
                      </button>
                    </div>
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-danger my-2"
                        onClick={toggleShow}
                      >
                        Späť
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
            <div><a href={"../course/" + question.course_id}>{"<"} Späť na kurz</a></div>
            <div className="card border-info">
              <div className="bg-info">
                <h2 className="mx-1">Titulok: {question.title}</h2>
                <h4 className="mx-1">Status: {question.is_open ? "Otvorená" : "Uzatvorená"}</h4>
                <div className=" mx-1">
                  Od:
                  {" " + author.first_name + " " + author.last_name}
                  {teachers.includes(question.user_id) && " (Učiteľ)"}
                  <br />
                  Dátum: {new Date(question.date).toLocaleString()}
                </div>
              </div>
              <div className=" mx-1">
                <p>{question.description}</p>
              </div>
            </div>
            <div className="container">
              {answers &&
                answers.map((answer, key) => {
                  return (
                    <div key={key}>
                      {showCloseQuestion && (
                        <>
                          <div>
                            <label htmlFor={"correct" + answer.id}>
                              Správna odpoveď:{" "}
                            </label>
                            <input
                              id={"correct" + answer.id}
                              name={"correct" + answer.id}
                              type="checkbox"
                              className="mx-1 align-middle"
                              onChange={() => toggleCorrectCheckbox(answer.id)}
                            />
                            {answer.upvotes.length === 0 && (
                              <>
                                <label htmlFor={"upvote" + answer.id}>
                                  Pridať bod:{" "}
                                </label>
                                <input
                                  id={"upvote" + answer.id}
                                  name={"upvote" + answer.id}
                                  type="checkbox"
                                  className="mx-1 align-middle"
                                  disabled={
                                    !answersCheckboxes[answer.id].correct
                                  }
                                  checked={answersCheckboxes[answer.id].upvoted}
                                  onChange={() =>
                                    toggleUpvoteCheckbox(answer.id)
                                  }
                                />
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <AnswerEntry
                        key={key}
                        id={answer.id}
                        user_id={answer.user_id}
                        teachers={teachers}
                        students={students}
                        description={answer.description}
                        date={answer.date}
                        is_correct={answer.is_correct}
                        reactions={answer.reactions}
                        upvotes={answer.upvotes}
                        totalUpvotes={totalUpvotes}
                        user={answer.user}
                        question_open={question.is_open}
                        loggedUser={loggedUser}
                        showCloseQuestion={showCloseQuestion}
                        hostname={hostname}
                      />
                    </div>
                  );
                })}

              <AddAnswerEntry
                teachers={teachers}
                students={students}
                loggedUser={loggedUser}
                course_id={question.course_id}
                question_open={question.is_open}
                question_author={question.user_id}
                answers_authors={question.answers.map((answer, key) => {
                  return answer.user_id;
                })}
                addAnswer={addAnswer}
                hostname={hostname}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="d-flex justify-content-center m-3">
          {statusCode ? "Otázka neexistuje." : "Načítavanie..."}
        </p>
      )}
    </>
  );
};

export default QuestionDetail;
/**/
