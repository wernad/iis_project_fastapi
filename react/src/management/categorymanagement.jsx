import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const CategoryManagement = ({teacherCourses, hostname}) => {
    const [coursesCategories, setCoursesCategories] = useState({})
    const [showCategories, setShowCategories] = useState(null);
    const [errors, setErrors] = useState(null);
    const [onSuccess, setOnSuccess] = useState("");
    const [rerender, setRerender] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    useEffect(() => {
      async function getCategories() {

        const params = teacherCourses.map((course) => {
          return "course_id=" + course.course.id;
        })

        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token,
          },
        };
  
        try {
          const response = await fetch(
            hostname + "mycoursecategories/?" + params.join('&'),
            requestOptions
          );
          
          const data = await response.json();
          let new_object = {};
          if(response.status == 200) {
          teacherCourses.forEach((course) => {
            const new_array = data.filter((category) => { 
                if (course.course.id === category.course_id) {
                  return category;
                }
              return null;
            })
            if(new_array.length > 0) {              
              new_object[course.course.id] = new_array;
            }
         
          })
        }

          setCoursesCategories(new_object);
          setLoaded(true);
        } catch (e) {
          console.log("error:" + e);
        }
      }
      getCategories();
    }, [rerender]);  
    
  const updateCategory = async (e) => {
      e.preventDefault()
      setOnSuccess("");
      setErrors("");
      const name = new FormData(e.target).get("categoryName");
      const id = new FormData(e.target).get("categoryId");
      if(name.length === 0) {
        setErrors("Názov nesmie byť prázdny.")
        return false;
      }
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
        body: JSON.stringify({
          name: name,
          id: id,
        }),
      };
  
      try {
        const response = await fetch(
          hostname + "updatecategory",
          requestOptions
        );
      
        const data = await response.json();
        
        if(response.status !== 200) {
          setErrors(data.detail)
          console.log("here " + errors)
        } else {
          setOnSuccess("Kategória aktualizovaná.")
          setRerender(!rerender);
        }
      } catch (e) {
        console.log("error:" + e);
      }
      document.getElementById("form" + id).reset();
      return false;
  };

const addCategory = async (e) => {
  e.preventDefault();
  setOnSuccess("");
  setErrors("");
  const name = new FormData(e.target).get("categoryName");
  const course_id = new FormData(e.target).get("courseId");
  
  if(name.length === 0) {
    setErrors("Názov nesmie byť prázdny.")
    return false;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
    },
    body: JSON.stringify({
      name: name,
      course_id: course_id,
    }),
  };

  try {
    const response = await fetch(
      hostname + "addcategory",
      requestOptions
    );

    const data = await response.json();    
    if(response.status !== 201) {
      setErrors(data.detail)
      console.log(errors)
    } else {
      setOnSuccess("Kategória pridaná.")
      setRerender(!rerender);
    }
    
  } catch (e) {
    console.log("error:" + e);
  }
  document.getElementById("formAdd").reset();
  return false;
};
  
    function updateShowCategory(id) {
        if (showCategories === id) {
          setShowCategories(null);
        } else {
          setShowCategories(id);
        }
      }

    return( <>
    {errors && <div className="h4 text-danger">{errors}</div>}
    {onSuccess && <div className="h4 text-success">{onSuccess}</div>}
    {loaded && teacherCourses &&
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
                      {showCategories !== course.course.id ? "Zobraziť kategórie" : "Skryť kategórie"}
                    </button>
                  )}
                </div>
                {showCategories === course.course.id && (
                  <div className="container" key={key}>
                    {coursesCategories[course.course.id] &&
                      coursesCategories[course.course.id].map(
                        (category, k) => {
                          return (
                            <>
                              <form
                              id={"form" + category.id}
                                className="my-2"
                                key={k}
                                onSubmit={(e) => (updateCategory(e))}
                              >
                                <input
                                  type="text"
                                  name="categoryName"
                                  id="categoryName"
                                  placeholder={category.name}
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
                    <form id="formAdd" onSubmit={(e) => addCategory(e)}>
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