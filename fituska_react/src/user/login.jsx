import React, { Component } from "react";
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const Login = () => {
  return (
      <Formik
        initialValues={{username: '', password: ''}}
      validationSchema={Yup.object({
        username: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
      })}
      onSubmit={async (values) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(
            "grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret="
          ),
        };
    
        const response = await fetch("http://localhost:8000/token", requestOptions);
        const data = await response.json();
      }}
    >
        <Form>
          <MyTextInput
            label="Email Address:"
            name="username"
            type="email"
          />

          <MyTextInput
            label="Password"
            name="password"
            type="password"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
  );
};

export default Login;
