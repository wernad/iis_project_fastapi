import React, { useEffect, useState } from "react";

import Navigation from "../forum/navbar";
import TopTotal from "./topUsersTotal";
import TopCourseTotal from "./topUsersCourse";

const Top = ({ loggedUser }) => {
  const [courses, setCourses] = useState([]);
  const [showTotal, setShowTotal] = useState(true);
  const [courseToShow, setCourseToShow] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getTopUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/courseswithupvotes/",
          requestOptions
        );

        const data = await response.json();

        setCourses(data);
        if (data) {
          let coursesToShow = {};
          data.forEach((course) => {
            coursesToShow[course.id] = false;
          });
        }
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    getTopUsers();
  }, [loaded]);

  function changeHandler(option) {
    if (!option.target.value) {
      setShowTotal(true);
      setCourseToShow(null);
    } else {
      setShowTotal(false);
      setCourseToShow(option.target.value);
    }
  }

  return (
    <>
      {loaded && (
        <>
          <Navigation loggedUser={loggedUser} />
          <div className="text-center">
            <h1>Rebríček užívateľov</h1>
            <select
              className="mx-auto h2 text-center"
              onChange={(value) => changeHandler(value)}
            >
              <option selected value="">
                Celkové
              </option>
              {courses &&
                courses.map((course, key) => {
                  return <option value={course.id}>{course.name}</option>;
                })}
            </select>
          </div>

          <div className="container">
            <div>{showTotal && <TopTotal />}</div>
            <div>
              {courses &&
                !showTotal &&
                courses.map((course, key) => {
                  return (
                    <>
                      {courseToShow == course.id && (
                        <div key={key}>
                          <TopCourseTotal
                            key={key}
                            course_id={course.id}
                            course_name={course.name}
                          />
                        </div>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Top;
