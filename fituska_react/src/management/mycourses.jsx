import React, { useEffect, useState } from "react";

import MyCoursesDetail from "./myCoursesDetail";

const MyCourses = ({ loggedUser }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getMyCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/mycourses/" + loggedUser,
          requestOptions
        );

        const data = await response.json();
        console.log("myc " + JSON.stringify(data));
        setMyCourses(data.courses);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    getMyCourses();
  }, []);
  return (
    <>
      {loaded && (
        <div className="">
          <div className="container">
            {myCourses &&
              myCourses.map((myCourse, key) => {
                return (
                  <div key={key}>
                    <MyCoursesDetail
                      is_teacher={myCourse.is_teacher}
                      user_approved={myCourse.is_approved}
                      course_approved={myCourse.course.is_approved}
                      course_id={myCourse.course_id}
                      categories={myCourse.course.categories}
                      course_name={myCourse.course.name}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default MyCourses;
