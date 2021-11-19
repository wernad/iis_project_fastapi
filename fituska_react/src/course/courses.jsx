import React, { useEffect, useState } from "react";

import Navigation from "../forum/navbar";
import CourseEntry from "./courseEntry";

const Courses = ({ loggedUser }) => {
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/courses",
          requestOptions
        );

        const data = await response.json();

        setCourses(data);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    fetchCourses();
  }, []);

  return (
    <>
      <Navigation loggedUser={loggedUser} />
      <div className="text-center">
        <h1>Kurzy</h1>
      </div>
      {loaded ? (
        <div className="container">
          {courses &&
            courses.map((course, key) => {
              return (
                <div key={key}>
                  <CourseEntry key={key} name={course.name} id={course.id} />
                </div>
              );
            })}
        </div>
      ) : (
        <p className="d-flex justify-content-center m-3">Loading...</p>
      )}
    </>
  );
};

export default Courses;
