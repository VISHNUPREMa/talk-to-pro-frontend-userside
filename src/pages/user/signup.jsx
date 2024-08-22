import React, { useState } from 'react';
import '../../style/signup.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../secrets/secret.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEmail } from '../contexts/userEmailContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import '../../Form.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9_]+$/, 'Invalid username format')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9\W])(?=.{6,})(?!.*[.\n]).*$/, 'Invalid Password format')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function Signup() {
  const navigate = useNavigate();
  const { setEmail: setGlobalEmail } = useEmail();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const { username, email, password } = values;

      const response = await axiosInstance.post(`${BACKEND_SERVER}/signup`, { username, email, password });
      if (response.status === 201) {
        setGlobalEmail(email);
        navigate('/verifyotp');
      } else {
        toast.error(response.data.message || 'Signup failed.', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error(error.response?.data?.error || 'An error occurred during signup.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <h2>Signup Form</h2>
        <div className="login_register">
          <a onClick={handleLogin} className="login" rel="noopener noreferrer">Login</a>
          <a className="register" rel="noopener noreferrer">Signup</a>
        </div>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="username"
                aria-label="Username"
              />
              <ErrorMessage name="username" component="div" className="error" />

              <Field
                type="email"
                name="email"
                placeholder="Email Address"
                className="email"
                aria-label="Email Address"
              />
              <ErrorMessage name="email" component="div" className="error" />

              <div className="password-container">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="pass"
                  aria-label="Password"
                />
                <span
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage name="password" component="div" className="error" />

              <div className="password-container">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="confirm_pass"
                  aria-label="Confirm Password"
                />
                <span
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="error" />

              <button type="submit" className="login_btn" disabled={isSubmitting}>Signup</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Signup;

