import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "@/components/AuthShell";
import PasswordInput from "@/components/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "../../config";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
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
      })
      .catch((err) => {
        if (err.response?.data?.message) {
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
    <AuthShell
      eyebrow="Join us"
      title="Your next beach escape starts here."
      subtitle="Create an account to book resorts, track reservations, and get booking updates by email."
    >
      <h1 className="font-display text-3xl font-semibold text-ink">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        autoComplete="off"
      >
        <div>
          <label htmlFor="username" className="text-sm font-medium text-ink/80">
            Full Name
          </label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your full name"
            required
            onChange={handleChange}
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink/80">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink/80">
            Password
          </label>
          <div className="mt-1.5">
            <PasswordInput
              id="password"
              name="password"
              placeholder="Create a password"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-2 w-full">
          Sign Up
        </Button>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            to="/signIn"
            className="font-medium text-lagoon-dark hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default SignUp;
