import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookie from "universal-cookie";

import Top from "../forum/top";
import Login from "../user/login";
import Register from "../user/register";
import Courses from "../course/courses";
import CourseDetail from "../course/courseDetail";
import QuestionDetail from "../question/questionDetail";
import Profile from "../user/profile";
import Navigation from "./navbar";

const CheckAuth = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const cookies = new Cookie();
  const access_token = cookies.get("access_token");
  const token_type = cookies.get("token_type");

  useEffect(() => {
    async function checkLoginStatus() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: access_token,
          token_type: token_type,
        }),
      };

      try {
        const response = await fetch(
          "http://localhost:8000/checkauth",
          requestOptions
        );

        const data = await response.json();

        setLoggedUser(data.id);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
        setErrors(e);
      }
    }
    if (access_token) {
      checkLoginStatus();
    } else {
      setLoaded(true);
      setLoggedUser(null);
    }
  }, []);

  return (
    <>
      {loaded ? (
        <BrowserRouter>
          <div>
            <Navigation loggedUser={loggedUser} />
            <Routes>
              <Route
                path="profile"
                element={<Profile loggedUser={loggedUser} />}
              />
              <Route path="login" element={<Login loggedUser={loggedUser} />} />
              <Route
                path="register"
                element={<Register loggedUser={loggedUser} />}
              />
              <Route path="/" element={<Courses loggedUser={loggedUser} />} />
              <Route
                exact
                path="course/:id"
                element={<CourseDetail loggedUser={loggedUser} />}
              />
              <Route
                path="questions/:id"
                element={<QuestionDetail loggedUser={loggedUser} />}
              />
              <Route path="top" element={<Top loggedUser={loggedUser} />} />
            </Routes>
          </div>
        </BrowserRouter>
      ) : (
        <p>Načítavanie...</p>
      )}
    </>
  );
};

export default CheckAuth;
