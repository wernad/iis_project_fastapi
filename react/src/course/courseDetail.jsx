import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import AddQuestion from "../question/addQuestion";

const CourseDetail = ({ loggedUser, hostname}) => {
  const [statusCode, setStatusCode] = useState();
  const [name, setName] = useState();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseUsers, setCourseUsers] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showApplied, setShowApplied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const cookies = new Cookies();
  const access_token = cookies.get("access_token");
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
          hostname + "course/" + id,
          requestOptions
        );

        const data = await response.json();

        setStatusCode(response.status);
        setName(data.name);
        setCategories(data.categories);
        setQuestions(data.questions);
        setCourseUsers(data.users);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
        setStatusCode(e);
      }
    }
    fetchCourseData();
  }, [id]);

  function toggleShow() {
    setShowAddQuestion(!showAddQuestion);
  }

  const addQuestion = async (e) => {
    const formData = new FormData(e.target);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        title: formData.get("questionTitle"),
        description: formData.get("questionText"),
        date: new Date().toISOString(),
        category_id: formData.get("questionCategory"),
        course_id: id,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        hostname + "addquestion",
        requestOptions
      );

      const data = await response.json();

      let new_questions = questions.slice();
      new_questions.push(data);
      setQuestions(new_questions);
    } catch (e) {
      console.log("error: " + e);
    }
  };

  const applyToCourse = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        course_id: id,
        user_id: loggedUser,
      }),
    };

    try {
      const response = await fetch(
        hostname + "coursesignup",
        requestOptions
      );

      const data = await response.json();

      let new_courseUsers = courseUsers.slice();
      new_courseUsers.push(data);
      setCourseUsers(new_courseUsers);
      setShowApplied(true);
    } catch (e) {
      console.log("error:" + e);
    }
  };

  function checkIfCanAsk() {
    if (!loggedUser) {
      return false;
    }
    const approvedUsers = courseUsers
      .filter((user) => {
        if (user.is_approved === true) {
          return user;
        }
        return null;
      })
      .map((user) => {
        return user.user_id;
      });
    if (!approvedUsers.includes(loggedUser)) {
      return false;
    }

    return true;
  }

  function checkIfCanApply() {
    if (!loggedUser) {
      return false;
    }
    const courseUsersId = courseUsers.map((user) => {
      return user.user_id;
    });

    if (courseUsersId.includes(loggedUser)) {
      return false;
    }
    return true;
  }

  function applySearchOnQuestion(question) {
    if (question.title.toLowerCase().includes(searchField.toLowerCase())) {
      return true;
    }

    if (
      question.category.name.toLowerCase().includes(searchField.toLowerCase())
    ) {
      return true;
    }

    return false;
  }

  return (
    <>
      {loaded && name ? (
        <>
          <div className="text-center">
            <h1>{name}</h1>
          </div>
          <AddQuestion
            className={`${!showAddQuestion && "d-none"}`}
            toggleShow={toggleShow}
            showAddQuestion={showAddQuestion}
            addQuestion={addQuestion}
            categories={categories}
            hostname={hostname}
          />

          <div className={`${showAddQuestion && "d-none"}`}>
            {checkIfCanAsk() && (
              <div className="text-center">
                <button className="btn btn-primary my-2" onClick={toggleShow}>
                  Pridať otázku
                </button>
              </div>
            )}
            {checkIfCanApply() && (
              <div className="text-center">
                <button
                  className="btn btn-primary my-2"
                  onClick={applyToCourse}
                >
                  Prihlásiť sa na kurz
                </button>
              </div>
            )}
            {showApplied && (<div className="text-center">
                  Prihlásili ste sa na kurz. Počkajte na schválenie žiadosti učiteľom.
              </div>)}
            {!checkIfCanAsk() && !checkIfCanApply() && (<div className="text-center">
                  Vaša žiadosť ešte nebola schválená.
              </div>)}
            <div className="container">
              <div className="my-1">
                <input
                  size="50"
                  placeholder="Zadajte názov otázky alebo kategórie"
                  type="text"
                  onChange={(e) => setSearchField(e.target.value)}
                ></input>
              </div>
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>Stav</th>
                    <th>Titul</th>
                    <th>Kategória</th>
                    <th>Dátum</th>
                  </tr>
                  
                  {questions &&
                    questions.map((question, key) => {
                      return (
                        <>
                          {applySearchOnQuestion(question) && (
                            <tr key={key}>
                              <td>
                                {question.is_open ? (
                                  <span>Otvorená</span>
                                ) : (
                                  <span>Uzatvorená</span>
                                )}
                              </td>
                              <td>
                                <Link to={`../questions/${question.id}`}>
                                  {question.title}
                                </Link>
                              </td>
                              <td>{question.category.name}</td>
                              <td>
                                {new Date(question.date).toLocaleDateString()}
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                </tbody>
              </table>
              {questions.length == 0 && <div>Kurz ešte nemá otázky.</div>}
            </div>
          </div>
        </>
      ) : (
        <p className="d-flex justify-content-center m-3">
          {statusCode ? "Kurz neexistuje alebo čaká na schválenie." : "Načítavanie..."}
        </p>
      )}
    </>
  );
};

export default CourseDetail;
