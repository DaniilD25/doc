import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { registerUrl } from '../const_urls';
import styles from '../styles/register.css';


export const Register = (props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const ErrorFunc = () => {
    setFormSubmitted(true);
  };
  const EyeChange = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        rpassword: '',
        email: '',
      }}
      validate={(values) => {
        const errors = {};

        if (!values.username) {
          errors.username = 'Данное поле должно быть заполнено';
        }
        if (!values.password) {
          errors.password = 'Данное поле должно быть заполнено';
        }

        if (!values.rpassword) {
          errors.rpassword = 'Данное поле должно быть заполнено';
        } else if (values.password !== values.rpassword) {
          errors.rpassword = 'Пароли не совпадают';
        }

        if (!values.email) {
          errors.email = 'Данное поле должно быть заполнено';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Неправильный email';
        }

        return errors;
      }}
      onSubmit={(values, { resetForm }) => {
        axios
          .post(registerUrl, {
            username: values.username,
            password: values.password,
            email: values.email,
          })
          .then((response) => {
            console.log(response.status, response.data);
            if (response.data.created === true) {
              props.click();
            } else {
              if (response.data.error === 'Email already exists') {
                alert('Такой email уже зарегистрирован');
              } else if (response.data.error === 'Username already exists') {
                alert('Такой логин уже зарегистрирован');
              } else {
                alert('Something went wrong');
              }
            }
          });
        resetForm();
      }}
    >
      {({ errors, touched }) => (
        <div className='register-page'>
          <Form className="reg-form col-xs-12 col-sm-7 col-md-5 col-lg-5 col-xl-4 col-xxl-3">
            <div className="label-registration-div">
              <div className="label-register">Зарегистрируйся</div>
            </div>




            <div className="label-register-div">
              <label className="label-register">Имя пользователя</label>
            </div>
            <div className="form-register-div">
              <Field
                id="username"
                name="username"
                className={`field-write form-register ${errors.username && formSubmitted ? 'field-error' : ''}`}
                placeholder="Введите имя пользователя"
              />
            </div>
            {formSubmitted && errors.username && touched.username && (
              <div className="error">{errors.username}</div>
            )}






            <div className="label-register-div">
              <label className="label-register">Пароль</label>
            </div>
            <div className="form-register-div ">
              <Field
                id="password"
                name="password"
                type={passwordType}
                className={`field-write form-register form-password ${errors.password && formSubmitted ? 'field-error' : passwordType == "password" ? 'points' :''}`}
                placeholder="Введите пароль"
              />
              <img className = {'eye'}
                        src={require(passwordType === 'password' ? '../imgs/eye.png' : '../imgs/eye-off.png')}
                        alt="Your Image"
                        onClick={EyeChange}
                      />
              </div>
              {formSubmitted && errors.password && touched.password && (
                <div className="error">{errors.password}</div>
              )}
            




            <div className="label-register-div">
              <label className="label-register">Повтор пароля</label>
            </div>
            <div className="form-register-div">
              <Field
                id="rpassword"
                name="rpassword"
                type={passwordType}
                className={`field-write form-register form-password ${errors.rpassword && formSubmitted ? 'field-error' : passwordType == "password" ? 'points' : ''}`}
                placeholder="Введите повтор пароля"
              />
              <img className = {'eye'}
                        src={require(passwordType === 'password' ? '../imgs/eye.png' : '../imgs/eye-off.png')}
                        alt="Your Image"
                        onClick={EyeChange}
                      />
              </div>
              {formSubmitted && errors.rpassword && touched.rpassword && (
                <div className="error">{errors.rpassword}</div>
              )}





            <div className="label-register-div">
              <label className="label-register">Email</label>
            </div>
            <div className="form-register-div">
              <Field
                id="email"
                name="email"
                type="email"
                className={`field-write form-register ${errors.email && formSubmitted ? 'field-error' : ''}`}
                placeholder="Введите email"
              />
              </div>
              {formSubmitted && errors.email && touched.email && (
                <div className="error">{errors.email}</div>
              )}
            


            <div className='button-register-div'>
              <button className="button-register" type="submit" onClick={ErrorFunc}>
                Зарегистрироваться
              </button>
            </div>
            <div className='button-login-div'>
              <p className='label-button-login'>Уже есть аккаунт? </p>
              <p
                className="button-login"
                onClick={props.redirect}
              >
                Войти
              </p>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};
