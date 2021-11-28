import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

import MyCourses from "../management/mycourses";
import CourseApproval from "../management/courseapproval";

const Profile = ({ loggedUser }) => {
  const [user, setUser] = useState({});
  const [loaded, setLoaded] = useState(false);

  const cookies = new Cookies();
    const access_token = cookies.get("access_token");

  useEffect(() => {
    async function fetchProfileData() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/profile/" + loggedUser,
          requestOptions
        );

        const data = await response.json();
        setUser(data);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }

    fetchProfileData();
    return () => {
      console.log("cleaned up");
    };
  }, []);
  if (loaded && !loggedUser) {
    window.location.href = "/login";
  }
  return (
    <>
      {loaded && loggedUser ? (
        <>
          <div className="col-md-5 my-1 mx-auto p-1">
            <h2 className="mx-1">Profil</h2>
            <div className="card d-flex flex-row">
              <div className="mx-2">
                <div className="">
                  Meno: {" " + user.first_name + " " + user.last_name}
                </div>
                <div className="">Kontakt: {" " + user.email}</div>
              </div>
            </div>
          </div>

          <div className="col-md-5 my-1 mx-auto p-1">
            <h2 className="mx-1">Moje kurzy</h2>
            <div className="card">
              <MyCourses loggedUser={loggedUser} />
            </div>
          </div>
          {(user.management_level === 0 || user.management_level === 1) && (
            <div className="col-md-5 my-1 mx-auto p-1">
              <h2 className="mx-1">Schválenie kurzov</h2>
              <div className="card">
                <CourseApproval loggedUser={loggedUser} />
              </div>
            </div>
          )}
          {user.management_level === 0 && (
            <div className="col-md-5 my-1 mx-auto p-1">
              <h2 className="mx-1">Správa užívateľov</h2>
            </div>
          )}
        </>
      ) : (
        <p>Načítavanie...</p>
      )}
    </>
  );
};

export default Profile;
