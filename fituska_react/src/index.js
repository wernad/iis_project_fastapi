import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./forum/home";
import Top from "./forum/top";
import Login from "./user/login";
import Register from "./user/register";
import Courses from "./course/courses";
import CourseDetail from "./course/courseDetail";
import QuestionDetail from "./question/questionDetail";
import UserDetail from "./user/userDetail";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="courses" element={<Courses />} />
      <Route path="courses/:id" element={<CourseDetail />} />
      <Route path="questions/:id" element={<QuestionDetail />} />
      <Route path="users/:id" element={<UserDetail />} />
      <Route path="top" element={<Top />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
