import React, { useEffect, useState } from "react";

const MyCourses = ({ loggedUser }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getMyCourses() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8000/mycourses/" + loggedUser.id,
          requestOptions
        );

        const data = await response.json();
        console.log(data);
        setMyCourses(data);
        setLoaded(true);
      } catch (e) {
        console.log("error:" + e);
      }

      getMyCourses();
    }
  }, []);
  return (
    <>
      <div></div>
    </>
  );
};

export default MyCourses;
