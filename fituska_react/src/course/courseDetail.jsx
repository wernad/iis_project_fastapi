import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navigation from "../forum/navbar";

const CourseDetail = () => {
  const [name, setName] = useState();
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  useEffect(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("http://localhost:8000/course/" + id);
    try {
      const response = await fetch(
        "http://localhost:8000/course/" + id,
        requestOptions
      );

      const data = await response.json();
      setName(data.name);
      setQuestions(data.questions);
      console.log("test: " + JSON.stringify(data));
      setLoaded(true);
    } catch (e) {
      console.log("error:" + e);
    }
  }, []);

  return (
    <>
      <Navigation />
      <div className="text-center">
        <h1></h1>
      </div>
      <div className="container">
        <p>{id}</p>
      </div>
    </>
  );
};

export default CourseDetail;
