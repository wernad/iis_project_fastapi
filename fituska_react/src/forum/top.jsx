import React, { useEffect, useState } from "react";

import TopTotal from "./topUsersTotal";
import TopCourseTotal from "./topUsersCourse";

const Top = ({ loggedUser, hostname }) => {
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
          hostname + "courseswithupvotes/",
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
      setCourseToShow(Number(option.target.value));
    }
  }

  return (
    <>
      {loaded && (
        <>
          <div className="text-center">
            <h1>Rebríček užívateľov</h1>
            <select
              defaultValue=""
              className="mx-auto h2 text-center"
              onChange={(value) => changeHandler(value)}
            >
              <option value="">Celkové</option>
              {courses &&
                courses.map((course, key) => {
                  return (
                    <option key={key} value={course.id}>
                      {course.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="container">
            <div>{showTotal && <TopTotal hostname={hostname}/>}</div>
            <div>
              {courses &&
                !showTotal &&
                courses.map((course, key) => {
                  return (
                    <>
                      {courseToShow === course.id && (
                        <div key={key}>
                          <TopCourseTotal
                            key={key}
                            course_id={course.id}
                            course_name={course.name}
                            hostname={hostname}
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
