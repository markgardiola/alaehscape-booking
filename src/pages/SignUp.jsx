import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/api/register_user`, values)
      .then((res) => {
        toast.success(res.data.success, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/signIn");
        console.log(res);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="border border-2 rounded-5 border-success p-5"
        autoComplete="off"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 className="text-center mb-4 text-success fw-bold">Sign Up</h1>

        <div>
          <label htmlFor="role" className="form-label text-success">
            Account Type
          </label>
          <select
            name="role"
            className="form-select mb-3"
            value={values.role}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <option value="user">User</option>
            <option value="owner">Resort Owner</option>
          </select>
        </div>

        <div>
          <label htmlFor="username" className="form-label text-success">
            Full Name
          </label>
          <input
            type="username"
            className="form-control"
            placeholder="Enter your Full Name"
            required
            name="username"
            onChange={handleChange}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label mt-3 text-success">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            required
            name="email"
            onChange={handleChange}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
        </div>

        <div>
          <label htmlFor="password" className="mt-3 text-success">
            Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              required
              name="password"
              onChange={handleChange}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            />
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              <i
                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
              ></i>
            </button>
          </div>
        </div>

        <div className="d-flex flex-column justify-content-center mt-4">
          <button className="btn btn-outline-success fw-bold" type="submit">
            Sign Up
          </button>

          <p className="mt-3 text-center text-success">
            Already have an account?
          </p>

          <Link to="/signIn" className="text-center text-success">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
