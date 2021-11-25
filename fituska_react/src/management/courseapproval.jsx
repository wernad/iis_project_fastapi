import React, { useEffect, useState } from "react";

const CourseApproval = ({ loggedUser }) => {
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getUnapprovedCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/unapprovedcourses",
          requestOptions
        );

        const data = await response.json();

        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    getUnapprovedCourses();
  }, []);

  return (
    <>
      {loaded && (
        <div className="container">
          <div className="mb-2">
            <div className="d-flex flex-row my-1 ">asd</div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseApproval;
