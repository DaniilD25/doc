import { Formik, Form, Field } from 'formik';
import styles from '../styles/login.css';
import axios from 'axios';
import { loginUrl, createQRUrl,loginOTPUrl} from '../const_urls';
import React, { useState } from 'react';



export const Login = (props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeSrc, setQRCodeSrc] = useState('');

  const [UserData, setUserData] = useState('');

  const [ReadyOTP, setReadyOTP] = useState(false);
  const [showOTPPassword, setShowOTPPassword] = useState(false);

  const ErrorFunc = () => {
    setFormSubmitted(true);
  };
  const EyeChange = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };
  const showQRCodeModal = () => {
    setShowQRCode(true);
  };
  const showQRCodeModalOFF = () => {
    setShowQRCode(false);
    setQRCodeSrc('');
  };
  const showOTPpassword = () => {
    setShowOTPPassword(true);
  };
  const showOTPpasswordOFF = () => {
    setShowOTPPassword(false);
  };



  return (
    <div>
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validate={(values) => {
        const errors = {};

        if (!values.username) {
          errors.username = 'Данное поле должно быть заполнено';
        }

        if (!values.password) {
          errors.password = 'Данное поле должно быть заполнено';
        }


        return errors;
      }}
      onSubmit={(values, { resetForm }) => {
        axios.post(loginUrl, { username: values['username'], password: values['password'] }).then((response) => {
          console.log(response.status, response.data);
          setUserData(values['username']);
          if (response.data['userFoundNot2FA'] === true) {
            localStorage.setItem('is_logged', 'true');
            localStorage.setItem('user', UserData);
            resetForm();
            props.click();
            

          } 
          else if (response.data['adminFound2FA'] === true) {
            showQRCodeModal();
            axios.post(createQRUrl, { username: values['username'], password: values['password'],}).then((response) => {
              setQRCodeSrc(response.data['QR']);
          });
          }
          else if (response.data['issFound2FA'] === true) {
            showQRCodeModal();
            axios.post(createQRUrl, { username: values['username'], password: values['password'],}).then((response) => {
              setQRCodeSrc(response.data['QR']);
          });
          }
          else if (response.data['userFound2FA'] === true) {
            showQRCodeModal();
            axios.post(createQRUrl, { username: values['username'], password: values['password'],}).then((response) => {
              setQRCodeSrc(response.data['QR']);
          });
          }
          else if (response.data['adminFoundOTP'] === true) {
            showOTPpassword();
          }
          else if (response.data['issFoundOTP'] === true) {
            showOTPpassword();
          }
          else if (response.data['userFoundOTP'] === true) {
            showOTPpassword();
          } else {
            alert('User with such login and password is not found');
          }
          resetForm();
          
        });
  
      }}
    >
      {({ errors, touched }) => (
        <div className="login-page">
          <Form className="log-form col-xs-12 col-sm-7 col-md-5 col-lg-5 col-xl-4 col-xxl-3">

            <div className="label-auto-div">
              <div className="label-auto">Авторизуйся</div>
            </div>

          {showQRCode && ( 
            <div className="confirmation-dialog-login">
              <div className='text-qr-div'>
                   <p>Это ваш QR для входа в аккаунт.</p>
              </div>
              <div className='text-qr-div'>
                   <p>Отсканируйте его в каком-нибудь приложении, например, Google Authenticator.</p>
              </div>
              <div className='text-qr-div'>
                   <p> Все последующие входы в аккаунт вам придется вводить код из этого приложения!</p>
              </div>
              <div className="QRPhoto-div">
                  {qrCodeSrc && <img src={`data:image/png;base64,${qrCodeSrc}`} alt="QR Code" />}
              </div>
              <div className='but-ok-div'>
                  <button className='btn btn-success' onClick={showQRCodeModalOFF}>OK</button>
              </div>
            </div>
          )}

            <div className="label-login-div">
              <label className="label-login">Имя пользователя</label>
            </div>
            <div className="form-login-div">
              <Field 
              id="username" 
              name="username" 
              className={`field-write-2 form-login ${errors.username && formSubmitted ? 'field-error-2' : ''}`}
              placeholder="Введите имя пользователя" 
              />
            </div>
            {formSubmitted && errors.username && touched.username && (
              <div className="error-2">{errors.username}</div>
            )}



            <div className="label-login-div">
              <label className="label-login">Пароль</label>
            </div>
            <div className="form-login-div">
              <Field 
              id="password" 
              name="password" 
              type={passwordType} 
              className={`field-write form-login form-password ${errors.password && formSubmitted ? 'field-error-2' : passwordType == "password" ? 'points' : ''}`} 
              placeholder="Введите пароль "
              />
              <img className = {'eye'}
                        src={require(passwordType === 'password' ? '../imgs/eye.png' : '../imgs/eye-off.png')}
                        alt="Your Image"
                        onClick={EyeChange}
                      />
            </div>
            {formSubmitted && errors.password && touched.password && (
                <div className="error-2">{errors.password}</div>
              )}



            <div className='button-login-div'>
            <button className="button-login-plogin" type="submit" onClick={ErrorFunc}>
                Войти
            </button>
            </div>
            <div className='button-register-div'>
              <p className='label-button-create'>Ещё нет аккаунта? </p>
              <p
                className="button-create"
                onClick={props.redirect}
              >
                Создать
              </p>
            </div>
          </Form>
        </div>
      )}
    </Formik>

    <Formik
      initialValues={{
        otp: '',

      }}
      validate={(values) => {
        const errors = {};

        if (!values.otp) {
          errors.otp = 'Данное поле должно быть заполнено';
        }
        return errors;
      }}
      onSubmit={(values, { resetForm }) => {
        axios.post(loginOTPUrl, { username: UserData, otp: values['otp'] }).then((response) => {     
          if (response.data['PasswordComplete'] === true) {
                localStorage.setItem('is_logged', 'true');
                localStorage.setItem('user', UserData);
                showOTPpasswordOFF();
                setReadyOTP(false);
                resetForm();
                props.clickUser();
                      
          } 
          else if (response.data['PasswordCompleteAdmin'] === true) {
            localStorage.setItem('is_logged_admin', 'true');
            localStorage.setItem('user', UserData);
            showOTPpasswordOFF();
            setReadyOTP(false);
            resetForm();
            props.clickAdmin();
            } 
            else if (response.data['PasswordCompleteISS'] === true) {
              localStorage.setItem('is_logged_iss', 'true');
              localStorage.setItem('user', UserData);
              showOTPpasswordOFF();
              setReadyOTP(false);
              resetForm();
              props.clickISS();
              } 
          else {
                showOTPpassword();
                alert('Invalid OTP');
          }
          }).catch((error) => {
              console.error('Error:', error);
          });
  
      }}
    >
      {({ errors, touched }) => (
        <div className="">

            {showOTPPassword && (
            <Form className="log-form col-xs-12 col-sm-7 col-md-5 col-lg-5 col-xl-4 col-xxl-3">
            <div className="confirmation-dialog-login">
            <div className="label-auto-div">
              <div className="label-auto">Введите пароль из приложения</div>
            </div>
            <div className='form-otp-div'>
             <Field 
              id="otp" 
              name="otp" 
              className={`field-write-2 form-otp  ${errors.otp && formSubmitted ? 'field-error' : ''}`}
              placeholder="Введите пароль из приложения" 
              />
              </div>
              {formSubmitted && errors.otp && touched.otp && (
                <div className="error-2">{errors.otp}</div>
              )}
              <div className='but-ok-div'>
              <button className='btn btn-success' type="submit" onClick={ErrorFunc}>Отправить</button>
              </div>
              
            </div>
            </Form>
          )}
          
        </div>
      )}
    </Formik>
    </div>

);
      }
