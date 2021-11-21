import React, { useEffect, useState } from "react";

const TopCourseTotal = ({ course_id, course_name }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getTopUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/topuserscourse/" + course_id,
          requestOptions
        );

        const data = await response.json();

        setTopUsers(data);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }
    }
    getTopUsers();
  }, [loaded]);
  return (
    <>
      {loaded && (
        <>
          <div className="container">
            <div className="card col-md-5 my-1 mx-auto p-1 ">
              <table className="table">
                <tr>
                  <th>Meno</th>
                  <th>Kontakt</th>
                  <th>Body</th>
                </tr>
                {topUsers &&
                  topUsers.map((user, key) => {
                    return (
                      <tr key={key}>
                        <td className="">
                          {user.first_name + " " + user.last_name}
                        </td>
                        <td className="">{user.email}</td>
                        <td className="">{user.votes}</td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TopCourseTotal;
