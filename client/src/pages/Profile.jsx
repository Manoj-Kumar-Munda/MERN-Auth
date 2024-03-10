import React from "react";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup.object({
  firstName: yup.string().min(3, "Must have atleast 3 characters"),
  username: yup
    .string()
    .required("username is required")
    .min(3, "must have atleast 3 characters"),
  email: yup.string().email("Invalid format").required("Email is required"),
  password: yup.string().required("Password is required"),
});
const Profile = () => {
  const { userInfo } = useSelector((store) => store.auth);

  console.log(userInfo);
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p> Fullname: { userInfo?.User.fullName}</p>
        <p> Username: { userInfo?.User.username}</p>
        <p> Email: { userInfo?.User.email}</p>
      </div>
    </div>
  );
};

export default Profile;
