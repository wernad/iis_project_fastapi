import React, { Component } from "react";
import axios from 'axios';
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

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters long').required('Required'),
});

const Registration = () => {
  return (
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '', program: ''}}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const requestOptions = {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: values.firstName,
            last_name: values.lastName, 
            email: values.email,
            password: values.password,
            program: values.program,
          }),
        };
        console.log(requestOptions)
        const response = await fetch("http://localhost:8000/register", requestOptions);
        const data = await response.json();
        console.log("error: " + JSON.stringify(data));
      }}
    >
        <Form>
          <MyTextInput
            label="First Name"
            name="firstName"
            type="text"
          />

          <MyTextInput
            label="Last Name"
            name="lastName"
            type="text"
          />

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

          <MySelect label="Program" name="program">
            <option value="">None</option>
            <option value="BIT">Bachelor</option>
            <option value="MIT">Master</option>
            <option value="DIT">Doctoral</option>
          </MySelect>

          <button type="submit">Submit</button>
        </Form>
      </Formik>
  );
};

export default Registration;
/*
const Registration = () => {
  return (
    <div>
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', password: '', year: '', program: ''}}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required').required('Required'),
        password: Yup.string().min(6, 'Must be at least 6 characters long').required('Required'),
        year: Yup.number()
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(true);
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >,
    {({
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
    }) => (
      <Form>
      <label htmlFor="firstName">First Name:</label>
      <Field name="firstName" type="text" />
      <ErrorMessage name="firstName" />

      <label htmlFor="lastName">Last Name:</label>
      <Field name="lastName" type="text" />
      <ErrorMessage name="lastName" />

      <label htmlFor="email">Email Address:</label>
      <Field name="email" type="email" />
      <ErrorMessage name="email" />
      <label htmlFor="password">Password:</label>
      <Field name="password" type="password" />
      <ErrorMessage name="password" />
      <label htmlFor="year">Year:</label>
      <Field name="year" type="number" min="1"/>
      <ErrorMessage name="year" />
      <label htmlFor="program">Program:</label>
      <Field name="program" type="select">
      <option value="bit">None</option>
      <option value="bit">BIT</option>
      <option value="mit">MIT</option>
      <option value="dit">DIT</option>
      </Field>
      <ErrorMessage name="program" />

      <button type="submit" disabled={isSubmitting}>Submit</button>
    </Form>
    )}
    </Formik>
    </div>
  );
};

export default Registration;*/

/*
    const student_info = this.state.checked ? (
      <div>
        <label>
          Ročník:
          <input type="number" min="1" value="1" />
        </label>
        <label>
          Program:
          <select name="program">
            <option value="BIT">Bakalársky</option>
            <option value="MIT">Magisterský</option>
            <option value="DIT">Doktorandský</option>
          </select>
        </label>
      </div>
    ) : null;

    return (
      <div>
        <h1>Registrácia</h1>
        <form onSubmit={this.handleSubmit} >
          <label>
            Meno:
            <input type="text" name="name" />
          </label>
          <label>
            Priezvisko:
            <input type="text" name="surname" />
          </label>
          <label>
            E-mail:
            <input type="text" name="username" />
          </label>
          <label>
            Heslo:
            <input type="password" name="password" />
          </label>
          <label>
            Som študent:
            <input
              type="checkbox"
              defaultChecked={this.state.checked}
              onChange={this.handleCheckbox}
              name="student_status"
            />
          </label>
          {student_info}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }*/