import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const CategoryManagement = ({teacherCourses}) => {
    const [showCategories, setShowCategories] = useState(null);
    const [errors, setErrors] = useState("");
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");
    const updateCategory = async (e) => {
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token,
          },
          body: JSON.stringify({
            name: new FormData(e.target).get("categoryName"),
            id: new FormData(e.target).get("categoryId"),
          }),
        };
    
        try {
          const response = await fetch(
            "http://localhost:8000/updatecategory",
            requestOptions
          );
        
          const data = await response.json();

        } catch (e) {
          console.log("error:" + e);
        }
    };
  
  const addCategory = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        name: new FormData(e.target).get("categoryName"),
        course_id: new FormData(e.target).get("courseId"),
      }),
    };
  
    try {
      const response = await fetch(
        "http://localhost:8000/addcategory",
        requestOptions
      );
  
      const data = await response.json();
      if(response.status !== 201) {
        setErrors(data.detail)
        console.log(errors)
      }
    } catch (e) {
      console.log("error:" + e);
    }
  };

    function updateShowCategory(id) {
        if (showCategories === id) {
          setShowCategories(null);
        } else {
          setShowCategories(id);
        }
      }
    return( <>
    {errors && <div>{errors}</div>}
    {teacherCourses &&
        teacherCourses.map((course, key) => {
          return (
            <>
              <div key={key}>
                <div className="d-flex flex-row d-flex justify-content-between">
                  <Link to={`/course/${course.course.id}`}>
                    {course.course.name}
                  </Link>
                  {!course.course.is_approved ? (
                    " Čaká sa na schválenie."
                  ) : (
                    <button
                      className="btn btn-info shadow-none"
                      onClick={() =>
                        updateShowCategory(course.course.id)
                      }
                    >
                      Zobraziť kategórie
                    </button>
                  )}
                </div>
                {showCategories === course.course.id && (
                  <div className="container">
                    {course.course.categories &&
                      course.course.categories.map(
                        (category, k) => {
                          return (
                            <>
                              <form
                                className="my-2"
                                key={k}
                                onSubmit={(e) => updateCategory(e)}
                              >
                                <input
                                  type="text"
                                  name="categoryName"
                                  id="categoryName"
                                  placeholder={category.name}
                                />
                                <input
                                  type="hidden"
                                  id="courseId"
                                  name="courseId"
                                  value={category.course_id}
                                />
                                <input
                                  type="hidden"
                                  id="categoryId"
                                  name="categoryId"
                                  value={category.id}
                                />
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Aktualizovať
                                </button>
                              </form>
                            </>
                          );
                        }
                      )}
                    <form onSubmit={(e) => addCategory(e)}>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        placeholder="Názov kategórie"
                      />
                      <input
                        type="hidden"
                        id="courseId"
                        name="courseId"
                        value={course.course.id}
                      />

                      <button
                        className="btn btn-primary"
                        type="submit"
                      >
                        Pridať
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          );
        })}</>)
}

export default CategoryManagement;