import React, { useEffect } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";

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

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be at least 6 characters long")
    .required("Required"),
});

const Register = ({ loggedUser }) => {
  if (loggedUser) {
    return <Navigate to="/profile" />;
  }

  return (
    <>
      {loggedUser && <Navigate to="/profile" />}
      <div className="d-flex justify-content-center m-3">
        <h3>Registrácia</h3>
      </div>
      <div className="container">
        <div className="form-wrapper col-md-4 mx-auto">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, isSubmitting) => {
              isSubmitting = true;
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  first_name: values.firstName,
                  last_name: values.lastName,
                  email: values.email,
                  password: values.password,
                }),
              };

              const response = await fetch(
                "http://localhost:8000/register",
                requestOptions
              );
              const data = await response.json();
              if (JSON.stringify(data)["status"] === 201) {
                this.props.history.push("/login");
              }
              isSubmitting = false;
            }}
          >
            {(isSubmitting) => (
              <Form className="needs-validation">
                <div className="form-group">
                  <MyTextInput label="Meno:*" name="firstName" type="text" />
                </div>
                <div className="form-group">
                  <MyTextInput
                    label="Priezvisko:*"
                    name="lastName"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <MyTextInput label="Email:*" name="email" type="text" />
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
                    Registrovať
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

export default Register;
