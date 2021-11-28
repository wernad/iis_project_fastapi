import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const CourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState();
    const [loaded, setLoaded] = useState(false);
    const[rerender, setRerender] = useState(false);
  const cookies = new Cookies();
  const access_token = cookies.get("access_token");

  useEffect(() => {
    async function getUnapprovedCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/unapprovedcourses",
          requestOptions
        );

        const data = await response.json();
        
        setCourses(data)
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }

    getUnapprovedCourses();
  }, []);

  const approveCourse = async (user_id, course_id) => {
    const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
        body: JSON.stringify({
          course_id: course_id,
          user_id: user_id
        }),
      };
      
      try {
        const response = await fetch(
          "http://localhost:8000/approvecourse",
          requestOptions
        );
          
        const data = await response.json();
        if(response.status !== 200) {
          setErrors(data.detail)
          console.log(errors)
        }
        setRerender(!rerender);
      } catch (e) {
        console.log("error:" + e);
      }
}

const rejectCourse = async (user_id, course_id) => {
  const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      body: JSON.stringify({
        course_id: course_id,
        user_id: user_id
      }),
    };
  
    try {
      const response = await fetch(
        "http://localhost:8000/rejectcourse",
        requestOptions
      );
      const data = await response.json();
      if(response.status !== 200) {
        setErrors(data.detail)
        console.log(errors)
      }
      
      setRerender(!rerender);
    } catch (e) {
      console.log("error:" + e);
    }
}

  return (
    <>{loaded &&
      <div>
    <table className="table">
                <tbody>
                  <tr>
                    <th>Kurz</th>
                    <th>Učiteľ</th>
                    <th>Akcia</th>
                  </tr>
                  
        {courses && 
        courses.map((user, key) => {
            return (
            <tr key={key}>
                <td className="">{user.name}</td>
                <td className="">
                  {user.first_name + " " + user.last_name}
                </td>
                
                <td>
                    <button className="btn btn-success" onClick={() => approveCourse(user.user_id, user.course_id)}>✓</button>{" "}
                    <button className="btn btn-danger" onClick={() => rejectCourse(user.user_id, user.course_id)}>X</button>
                </td>
              </tr>)
        })}
        </tbody>
              </table>
              {courses.length === 0 && <div>Žiadny kurz nevyžaduje schválenie.</div>}
        </div>}
    </>
  );
};

export default CourseApproval;
