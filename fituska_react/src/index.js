import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./forum/home";
import Login from "./user/login";
import Register from "./user/register";
import Courses from "./course/courses";
import CourseDetail from "./course/courseDetail";
import Top from "./forum/top";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="courses" element={<Courses />} />
      <Route path="courses/:id" element={<CourseDetail />} />
      <Route path="top" element={<Top />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
