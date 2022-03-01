import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import CategoryManagement from "../management/categorymanagement";
import UserApproval from "./userapproval";

const MyCourses = ({ loggedUser, hostname }) => {
  const [studentCourses, setStudentCourses] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [showComponent, setShowComponent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const cookies = new Cookies();
    const access_token = cookies.get("access_token");

  useEffect(() => {
    async function getMyCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
      };

      try {
        const response = await fetch(
          hostname + "mycourses/" + loggedUser,
          requestOptions
        );

        const data = await response.json();

        setTeacherCourses(
          data.courses.filter((course) => {
            if (course.is_teacher === true) {
              return course;
            }
            return null;
          })
        );

        setStudentCourses(
          data.courses.filter((course) => {
            if (course.is_teacher === false) {
              return course;
            }
            return null;
          })
        );

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
            <div className="mb-2">
              <div className="d-flex flex-row my-1 ">
                <button
                  onClick={() => setShowComponent(0)}
                  className={`btn shadow-none mx-1 ${
                    showComponent===0  ? "btn-primary" : ""
                  }`}
                >
                  Navštevované
                </button>
                <button
                  onClick={() => setShowComponent(1)}
                  className={`btn shadow-none mx-1 ${
                    showComponent===1 ? "btn-primary" : ""
                  }`}
                >
                  Vyučované
                </button>
                <button
                  onClick={() => setShowComponent(2)}
                  className={`btn shadow-none mx-1 ${
                    showComponent===2  ? "btn-primary" : ""
                  }`}
                >
                  Schválenie študentov
                </button>
              </div>
              <div>
                <div className="container">
                  {showComponent===0 &&
                    studentCourses &&
                    studentCourses.map((course, key) => {
                      return (
                        <>
                          <div key={key}>
                            <div>
                              <Link to={`/course/${course.course.id}`}>
                                {course.course.name}
                              </Link>
                              {!course.is_approved && " Čaká sa na schválenie."}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div>
              {showComponent===1 &&
                <div className="container">
                  <CategoryManagement teacherCourses={teacherCourses} hostname={hostname}/>
                </div>
              }
              {showComponent===2 && 
              <div className="container">
                <UserApproval hostname={hostname}/>
                </div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCourses;
