import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="text-center">
        <h1>Kurzy</h1>
      </div>
      {loaded ? (
        <div className="container">
          {courses &&
            courses.map((course, key) => {
              return (
                <div key={key}>
                  <div className="card col-md-5 my-1 mx-auto">
                    <div className="mx-auto my-2">
                      <Link to={`./course/${course.id}`}> {course.name}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="d-flex justify-content-center m-3">Načítavanie...</p>
      )}
    </>
  );
};

export default Courses;
