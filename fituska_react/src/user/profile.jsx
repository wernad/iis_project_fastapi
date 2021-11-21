import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import MyCourses from "../management/myCourses";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input
        className={
          "form-control" + (meta.error && meta.touched ? " is-invalid" : "")
        }
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="invalid-feedback">{meta.error}</div>
      ) : null}
    </>
  );
};

const ValidationSchemaEmail = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
});

const ValidationSchemaPassword = Yup.object({
  password: Yup.string().required("Required"),
});

const Profile = ({ loggedUser }) => {
  const [user, setUser] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
    return <Navigate to="/" />;
  }

  return (
    <>
      {!loggedUser && <Navigate to="/login" />}
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
            <MyCourses loggedUser={loggedUser} />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Profile;
