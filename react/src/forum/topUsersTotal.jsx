import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const TopTotal = ({hostname}) => {
  const [topUsers, setTopUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const cookies = new Cookies();
  const access_token = cookies.get("access_token");

  useEffect(() => {
    async function getTopUsers() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
        },
      };

      try {
        const response = await fetch(
          hostname + "topusers/",
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
  }, []);
  return (
    <>
      {loaded && (
        <>
          <div className="container">
            <div className="card col-md-5 my-1 mx-auto p-1 ">
              <table className="table">
                <tbody>
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
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TopTotal;
