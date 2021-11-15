import React from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import Navigation from "../forum/navbar";

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
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  return (
    <>
      <Navigation />
      <div className="d-flex justify-content-center m-3">
        <h3>Prihlásenie</h3>
      </div>
      <div className="container ">
        <div className="form-wrapper col-md-4 mx-auto">
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={ValidationSchema}
            onSubmit={async (values, isSubmitting) => {
              isSubmitting = true;
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(
                  `grant_type=&username=${values.email}&password=${values.password}&scope=&client_id=&client_secret=`
                ),
              };

              const response = await fetch(
                "http://localhost:8000/token",
                requestOptions
              );
              const data = await response.json();
              console.log(JSON.stringify(data));
              isSubmitting = false;
            }}
          >
            {(isSubmitting) => (
              <Form className="needs-validation">
                <div className="form-group">
                  <MyTextInput label="Email:" name="email" type="email" />
                </div>
                <div className="form-group">
                  <MyTextInput label="Heslo:" name="password" type="password" />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-primary my-2"
                    type="submit"
                    //disabled={isSubmitting}
                  >
                    Prihlásiť sa
                  </button>
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
