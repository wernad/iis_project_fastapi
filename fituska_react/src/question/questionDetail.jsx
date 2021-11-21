import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navigation from "../forum/navbar";
import AnswerEntry from "../answer/answerEntry";

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
  return (
    <>
      <Navigation loggedUser={loggedUser} />
      {loaded && question ? (
        <>
          <div className=" col-md-8 my-1 mx-auto p-1 ">
            <div className="card border-info">
              <div className="bg-info">
                <h2 className="mx-1">Titulok: {question.title}</h2>
                <div className=" mx-1">
                  Od:
                  <Link className="text-dark mx-1" to={"../users/" + author.id}>
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
