import React, { useState } from "react";
import Cookies from "universal-cookie";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { useNavigate, Navigate } from "react-router-dom";

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

const ValidationSchema = Yup.object({
  email: Yup.string().email("Email nemá správny formát.").required("Povinné"),
  password: Yup.string().required("Povinné"),
});

const Login = ({ loggedUser }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");

  function loginHandler(tokenData) {
    const cookies = new Cookies();

    cookies.set("access_token", tokenData.access_token, {
      httpOnly: false,
      maxAge: 3600,
      path: "/",
    });

    navigate(navigate(-1), { replace: true });
  }

  return (
    <>
      {loggedUser && <Navigate to="/profile" />}
      <div className="d-flex justify-content-center m-3">
        <h3>Prihlásenie</h3>
      </div>
      <div className="container ">
        <div className="form-wrapper col-md-4 mx-auto">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={ValidationSchema}
            onSubmit={async (values) => {
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(
                  `grant_type=&username=${values.email}&password=${values.password}&scope=&client_id=&client_secret=`
                ),
              };

              try {
                const response = await fetch(
                  "http://localhost:8000/token",
                  requestOptions
                );

                const data = await response.json();
                if (response.status === 200) {
                  loginHandler(data);
                } else {
                  setErrors(data.detail);
                }
              } catch (e) {
                console.log("error:" + e);
              }
            }}
          >
            {() => (
              <Form className="needs-validation">
                {errors && <div className="h6 text-danger">{errors}</div>}
                <div className="form-group">
                  <MyTextInput label="Email:*" name="email" type="text" placeholder="name@mail.com"/>
                </div>
                <div className="form-group">
                  <MyTextInput
                    label="Heslo:*"
                    name="password"
                    type="password"
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary my-2" type="submit">
                    Prihlásiť sa
                  </button>
                  <div>*Povinné údaje.</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;