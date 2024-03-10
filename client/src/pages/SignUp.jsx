import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

const schema = yup.object({
  firstName: yup.string().min(3, "Must have atleast 3 characters"),
  username: yup
    .string()
    .required("username is required")
    .min(3, "must have atleast 3 characters"),
  email: yup.string().email("Invalid format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const res = await fetch("http://localhost:4000/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (response.statusCode >= 400) {
        setIsLoading(false);
        throw new Error(response.message);
      }
      console.log("Data submitted successfully");
      setIsLoading(false);
      setErr(null);
      const result = await axios.post("/api/v1/user/login",{
        usernameOrEmail : data.username,
        password : data.password
      });
      console.log(result);
      dispatch(setCredentials(result?.data.data));
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErr(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-bold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input placeholder={"Full name"} {...register("fullName")} />
        <p className="text-red-600 text-sm">{errors.firstName?.message}</p>
        <Input
          placeholder={"Username"}
          {...register("username")}
          className={`${
            errors.username && "focus:ring-red-600 ring-1 ring-red-600"
          }`}
        />
        <p className="text-red-600 text-sm">{errors.username?.message}</p>

        <Input
          placeholder={"Email"}
          {...register("email")}
          className={`${
            errors.email && "focus:ring-red-600 ring-1 ring-red-600"
          }`}
        />
        <p className="text-red-600 text-sm">{errors.email?.message}</p>

        <Input
          placeholder={"Password"}
          type={"password"}
          {...register("password")}
          className={`${
            errors.password && "focus:ring-red-600 ring-1 ring-red-600"
          }`}
        />
        <p className="text-red-600 text-sm">{errors.password?.message}</p>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <span>Loading...</span> : <span>Submit</span>}
        </Button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <span className="text-blue-500">
          <Link to={"/sign-in"}>Login</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
