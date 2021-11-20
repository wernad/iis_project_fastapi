import React, { useEffect, useState } from "react";

const MyCoursesDetail = ({
  is_teacher,
  user_approved,
  course_approved,
  course_id,
  course_name,
  categories,
}) => {
  console.log(course_name);
  return (
    <>
      <div className="card">
        <div className="container">
          <div>
            {course_name} <span>Spravovať kategórie</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCoursesDetail;
