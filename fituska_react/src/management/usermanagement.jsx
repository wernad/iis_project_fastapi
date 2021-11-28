import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

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

  const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label htmlFor={props.id || props.name}>{label}</label>
        <select className="form-control" {...field} {...props}/>
        {meta.touched && meta.error ? (
          <div className="invalid-feedback">{meta.error}</div>
        ) : null}
      </div>
    );
  };

  const MyCheckbox = ({ children, ...props }) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
      <div>
        <label className="checkbox-input form-control">
          <input type="checkbox" className="mx-1" {...field} {...props} />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="invalid-feedback">{meta.error}</div>
        ) : null}
      </div>
    );
  };
  
  const validationSchemaAdd = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters long")
      .required("Required"),
    role: Yup.number().required("Required"),
    isActive: Yup.boolean()
  });

  const validationSchemaUpdate = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters long"),
    role: Yup.number().required("Required"),
    isActive: Yup.boolean()
  });

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState();
    const [loaded, setLoaded] = useState(false);
    const[rerender, setRerender] = useState(false);
    const cookies = new Cookies();
    const access_token = cookies.get("access_token");

    useEffect(() => {
        async function getMyCourses() {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + access_token,
            },
          };
    
          try {
            const response = await fetch(
              "http://localhost:8000/users",
              requestOptions
            );
                
            const data = await response.json();
    
            setUsers(data)
            setLoaded(true);
          } catch (e) {
            console.log("error:" + e);
          }
        }
        getMyCourses();
      }, []);  

    return (
    <>{loaded && <div>
        <table className="table">
            <tbody>
                <tr>
                    <th>Meno</th>
                    <th>Priezvisko</th>
                    <th>Email</th>
                    <th>Heslo</th>
                    <th>Rola</th>
                    <th>Status</th>
                </tr>
            </tbody>
            </table>
        {users && 
        users.map((user, key) => {
            return (
                <Formik key={key}
            initialValues={{
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              password: "",
              role: user.management_level,
              isActive: user.is_active
            }}
            validationSchema={validationSchemaUpdate}
            onSubmit={async (values, isSubmitting) => {
              isSubmitting = true;

              const requestOptions = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + access_token,
                },
                body: JSON.stringify({
                    id: user.id,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    password: values.password,
                    is_active: values.isActive,
                    management_level: values.role
                }),
              };
              console.log(requestOptions.body)
              try {
                const response = await fetch(
                  "http://localhost:8000/updateuser",
                  requestOptions
                );
                  
                const data = await response.json();
                if(response.status !== 200) {
                  setErrors(data.detail)
                  console.log(errors)
                }
                setRerender(!rerender);
              } catch (e) {
                console.log("error:" + e);
              }
              isSubmitting = false;
            }}
          >
            {() => (
              <Form className="needs-validation d-flex flex-row justify-content-between  align-items-center" key={key}>
                
                
                <div className="form-group">
                  <MyTextInput name="firstName" type="text" />
                </div>
                
                <div className="form-group">
                  <MyTextInput
                   
                    name="lastName"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <MyTextInput name="email" type="text" placeholder="name@mail.com" />
                </div>
                <div className="form-group">
                  <MyTextInput
                    name="password"
                    type="password"
                  />
                </div>
                <div className="form-group">
                <MySelect name="role" >
                    <option value="0">Administrátor</option>
                    <option value="1">Moderátor</option>
                    <option value="2">Registrovaný užívateľ</option>
                </MySelect>
                </div>
                <div className="form-group">
                <MyCheckbox name="isActive" >
                    Aktívny
                </MyCheckbox>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary my-2" type="submit">
                    Aktualizovať
                  </button>
                  
                </div>
              </Form>
            )}
          </Formik>

        )})
        }
        <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              role: 2,
              isActive: true
            }}
            validationSchema={validationSchemaAdd}
            onSubmit={async (values, isSubmitting) => {
              isSubmitting = true;

              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + access_token,
                },
                body: JSON.stringify({
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    password: values.password,
                    is_active: values.is_active,
                    management_level: values.role
                }),
              };
              
              try {
                const response = await fetch(
                  "http://localhost:8000/adduser",
                  requestOptions
                );
                  
                const data = await response.json();
                if(response.status !== 200) {
                  setErrors(response.detail)
                  console.log(errors)
                }
              } catch (e) {
                console.log("error:" + e);
              }
              isSubmitting = false;
            }}
          >
            {() => (
              <Form className="needs-validation d-flex flex-row justify-content-between  align-items-center">
               
                
                <div className="form-group">
                  <MyTextInput name="firstName" type="text" placeholder="Meno*"/>
                </div>
                
                <div className="form-group">
                  <MyTextInput
                    name="lastName"
                    type="text"
                    placeholder="Priezvisko*"
                  />
                </div>
                <div className="form-group">
                  <MyTextInput name="email" type="text" placeholder="name@mail.com*" />
                </div>
                <div className="form-group">
                  <MyTextInput
                    name="password"
                    type="password"
                    placeholder="Heslo*"
                  />
                </div>
                <div className="form-group">
                <MySelect name="role">
             <option value="0">Administrátor</option>
             <option value="1">Moderátor</option>
             <option value="2">Registrovaný užívateľ</option>
            </MySelect>
                </div>
                <div className="form-group">
                <MyCheckbox name="isActive">
                    Aktívny
                </MyCheckbox>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary my-2" type="submit" style={{width: 115}}>
                    Pridať
                  </button>
                  
                </div>
              </Form>
            )}
          </Formik>
          <div>*Povinné údaje.</div>
          </div>}
        </>
        )
}

export default UserManagement;