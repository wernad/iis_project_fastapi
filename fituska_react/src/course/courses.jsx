import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Courses = ({ loggedUser }) => {
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseText, setNewCourseText] = useState("");
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

  const addCourse = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCourseText,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/addcourse",
        requestOptions
      );

      const data = await response.json();
      setErrors(response.status);
      setShowAddCourse(false);
    } catch (e) {
      console.log("error:" + e);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1>Kurzy</h1>
      </div>
      {errors && (
        <div className="text-center">
          {" "}
          {errors !== 200
            ? "Kurz sa nepodarilo pridať"
            : " Kurz pridaný. Počkajte na jeho schválenie."}
        </div>
      )}
      {loggedUser && !showAddCourse && (
        <div className="text-center">
          <button
            className="btn btn-primary my-2"
            onClick={() => setShowAddCourse(!showAddCourse)}
          >
            Pridať kurz
          </button>
        </div>
      )}
      {loggedUser && showAddCourse && (
        <>
          <div className="container">
            <div className="col-md-5 my-1 mx-auto text-center">
              <div>
                <label className="mx-1" htmlFor="courseTitle">
                  Titul nového kurzu:
                </label>
                <input
                  type="text"
                  id="courseTitle"
                  name="courseTitle"
                  onChange={(e) => setNewCourseText(e.target.value)}
                />
              </div>
              {newCourseText.trim().length > 0 ? (
                ""
              ) : (
                <span className="h6 text-danger">
                  *Text odpovede nesmie byť prázdny.
                </span>
              )}
              <br />

              <button
                disabled={newCourseText.trim().length === 0}
                className="btn btn-primary mx-auto"
                onClick={addCourse}
              >
                Vytvoriť
              </button>
              <button
                className="btn btn-danger mx-auto"
                onClick={() => setShowAddCourse(!showAddCourse)}
              >
                Späť
              </button>
            </div>
          </div>
        </>
      )}
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
