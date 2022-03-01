import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "universal-cookie";

import Top from "../forum/top";
import Login from "../user/login";
import Register from "../user/register";
import Courses from "../course/courses";
import CourseDetail from "../course/courseDetail";
import QuestionDetail from "../question/questionDetail";
import Profile from "../user/profile";
import Navigation from "./navbar";

const CheckAuth = () => {
  const hostname = 'http://104.238.158.167:443/'
  const [loggedUser, setLoggedUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const cookies = new Cookies();

  const access_token = cookies.get("access_token");

  useEffect(() => {
    async function checkLoginStatus() {
      const requestOptions = {
        method: "POST",
        headers: {
          "credentials": "include",
          "Authorization": "Bearer " + access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: access_token,
        }),
      };

      try {
        const response = await fetch(
          hostname + "checkauth",
          requestOptions
        );

        const data = await response.json();
        
        setLoggedUser(data.id);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
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
            <Navigation loggedUser={loggedUser} hostname={hostname}/>
            <Routes>
              <Route
                path="profile"
                element={<Profile loggedUser={loggedUser} hostname={hostname}/>}
              />
              <Route path="login" element={<Login loggedUser={loggedUser} hostname={hostname}/>} />
              <Route
                path="register"
                element={<Register loggedUser={loggedUser} hostname={hostname}/>}
              />
              <Route path="/" element={<Courses loggedUser={loggedUser} hostname={hostname}/>} />
              <Route
                exact
                path="course/:id"
                element={<CourseDetail loggedUser={loggedUser} hostname={hostname}/>}
              />
              <Route
                path="questions/:id"
                element={<QuestionDetail loggedUser={loggedUser} hostname={hostname}/>}
              />
              <Route path="top" element={<Top loggedUser={loggedUser} hostname={hostname}/>} />
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
