import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import * as yup from "yup";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import axios from "axios";

const schema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required("Username or email is required")
    .test("isUsernameOrEmail", "Invalid username or email format", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || value.length >= 3;
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(3, "Password must be at least 3 characters long"),
});

const SignIn = () => {

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  // const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log(data);
      const res = await axios.post("/api/v1/user/login", data);

      console.log(res?.data.data.User);

      dispatch(setCredentials(res?.data.data));

      if (!res.success) {
        throw new Error(res.message);
      }

      console.log("User successfully logged in :", result);

      setIsLoading(false)
      setErr(null);
      navigate("/");
    } catch (error) {
      setErr(error.message);
      setIsLoading(false)
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-bold my-7">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          placeholder={"Username or email"}
          {...register("usernameOrEmail")}
          className={`${
            errors.usernameOrEmail && "focus:ring-red-600 ring-1 ring-red-600"
          }`}
        />
        <p className="text-red-600 text-sm">
          {errors.usernameOrEmail?.message}
        </p>

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
    </div>
  );
};

export default SignIn;
