import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const UserApproval = () => {
    const [unapprovedUsers, setUnapprovedUsers] = useState([]);
    const [errors, setErrors] = useState();
    const [loaded, setLoaded] = useState(false);
    const[rerender, setRerender] = useState(false);
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    useEffect(() => {
        async function getMyCourses() {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + access_token,
            },
          };
    
          try {
            const response = await fetch(
              "http://localhost:8000/unapprovedusers",
              requestOptions
            );
                
            const data = await response.json();
    
            setUnapprovedUsers(data)
            
            setLoaded(true);
          } catch (e) {
            console.log("error:" + e);
          }
        }
        getMyCourses();
      }, []);  
    
    const approveUser = async (user_id, course_id) => {
        const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + access_token,
            },
            body: JSON.stringify({
              user_id: user_id,
              course_id: course_id
            }),
          };
          console.log(requestOptions.body)
          try {
            const response = await fetch(
              "http://localhost:8000/approveusercourse",
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

    const rejectUser = async (user_id, course_id) => {
      const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token,
          },
          body: JSON.stringify({
            user_id: user_id,
            course_id: course_id
          }),
        };
      
        try {
          const response = await fetch(
            "http://localhost:8000/rejectusercourse",
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
                    <th>Študent</th>
                    <th>Kurz</th>
                    <th>Akcia</th>
                  </tr>
                  
        {unapprovedUsers && 
        unapprovedUsers.map((user, key) => {
            return (
            <tr key={key}>
                <td className="">
                  {user.first_name + " " + user.last_name}
                </td>
                <td className="">{user.name}</td>
                <td>
                    <button className="btn btn-success" onClick={() => approveUser(user.user_id, user.course_id)}>✓</button>{" "}
                    <button className="btn btn-danger" onClick={() => rejectUser(user.user_id, user.course_id)}>X</button>
                </td>
              </tr>)
        })}
        </tbody>
              </table>
              {unapprovedUsers.length === 0 && <div>Žiadny študent nečaká na schválenie.</div>}
        </div>}
        </>
        )
}

export default UserApproval;