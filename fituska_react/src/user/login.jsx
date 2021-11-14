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

const ValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
})

const Login = () => {
  return (
      <Formik
        initialValues={{username: '', password: ''}}
      validationSchema={ValidationSchema}
      onSubmit={async (values) => {
        const requestOptions = {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: JSON.stringify(
            `grant_type=&username=${values.email}&password=${values.password}&scope=&client_id=&client_secret=`
          ),
        };
        
        const response = await fetch("http://localhost:8000/token", requestOptions);
        const data = await response.json();
        console.log(JSON.stringify(data));
      }}
    >
        <Form>
          <MyTextInput
            label="Email Address:"
            name="email"
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
