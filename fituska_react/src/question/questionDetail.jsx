import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import AnswerEntry from "../answer/answerEntry";
import AddAnswerEntry from "../answer/addAnswerEntry";

const QuestionDetail = ({ loggedUser }) => {
  const [author, setAuthor] = useState({});
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

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
          "http://localhost:8000/question/" + id,
          requestOptions
        );

        const data = await response.json();

        setQuestion(data);
        setAuthor(data.user);
        setAnswers(data.answers);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    fetchQuestionData();
  }, [id]);

  const addAnswer = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        "http://localhost:8000/addanswer",
        requestOptions
      );

      const data = await response.json();

      let new_answers = answers;
      new_answers.append(data);
      setAnswers(new_answers);
    } catch (e) {
      console.log("error:" + e);
    }
  };

  return (
    <>
      {loaded && question ? (
        <>
          <div className=" col-md-8 my-1 mx-auto p-1 ">
            <div className="card border-info">
              <div className="bg-info">
                <h2 className="mx-1">Titulok: {question.title}</h2>
                <div className=" mx-1">
                  Od:
                  <Link
                    className="text-dark mx-1"
                    to={"../users/" + question.user_id}
                  >
                    {author.first_name + " " + author.last_name}
                  </Link>
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
                      <AnswerEntry
                        key={key}
                        id={answer.id}
                        description={answer.description}
                        date={answer.date}
                        is_correct={answer.is_correct}
                        reactions={answer.reactions}
                        upvotes={answer.upvotes}
                        user={answer.user}
                        question_open={question.is_open}
                        loggedUser={loggedUser}
                      />
                    </div>
                  );
                })}

              <AddAnswerEntry
                loggedUser={loggedUser}
                question_id={id}
                question_open={question.is_open}
                question_author={question.user_id}
                answers_authors={question.answers.map((answer, key) => {
                  return answer.user_id;
                })}
                addAnswer={addAnswer}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="d-flex justify-content-center m-3">Loading...</p>
      )}
    </>
  );
};

export default QuestionDetail;
/**/
