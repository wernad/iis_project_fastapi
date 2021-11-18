import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navigation from "../forum/navbar";
import QuestionEntry from "../question/questionEntry";

const CourseDetail = () => {
  const [name, setName] = useState();
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchCourseData() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/course/" + id,
          requestOptions
        );

        const data = await response.json();

        setName(data.name);
        setQuestions(data.questions);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    fetchCourseData();
  }, [id]);

  return (
    <>
      <Navigation />
      {loaded && name ? (
        <>
          <div className="text-center">
            <h1>{name}</h1>
          </div>
          <div className="container">
            {questions &&
              questions.map((question, key) => {
                return (
                  <div key={key}>
                    <QuestionEntry
                      key={key}
                      name={question.title}
                      category={question.category}
                      is_open={question.is_open}
                      date={question.date}
                      id={question.id}
                    />
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <p className="d-flex justify-content-center m-3">Loading...</p>
      )}
    </>
  );
};

export default CourseDetail;
