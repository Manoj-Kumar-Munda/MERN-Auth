import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import { useLogoutMutation } from "../store/slices/usersApiSlice";
import { logout } from "../store/slices/authSlice";
import axios from "axios";
import jwtInterceptor from "../service/jwtinterceptor";


const Header = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);

  // const [logoutApiCall] = useLogoutMutation();

  const logoutUser = async () => {
    try {
      console.log("Hello....")
      const res = await jwtInterceptor.post("/api/v1/user/logout",{
        withCredentials:true
      });

      console.log("response : ",res);

      dispatch(logout());
    } catch (error) {
      dispatch(logout())
      console.log(error);
      setError(error?.data.message);
    }
  };

  // if (isLoading) {
  //   return <h1>Loading...</h1>;
  // }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <header className="bg-blue-600">
      <nav className="flex flex-row flex-wrap justify-between items-center px-8 py-2 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold text-white ">Auth App</h1>

        <ul className="flex flex-row gap-4">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `font-semibold ${isActive && "text-white"}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/about"}
              className={({ isActive }) =>
                `font-semibold ${isActive && "text-white"}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/profile"}
              className={({ isActive }) =>
                `font-semibold ${isActive && "text-white"}`
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>

        <ul className="flex flex-row gap-2 items-center">
          <li>
            {userInfo ? (
              <button
                onClick={() => {
                  logoutUser();
                }}
                className="bg-red-600 text-white outline-none text-center font-semibold px-4 py-1.5 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to={"/sign-in"}
                className={`text-center font-semibold border px-4 py-1.5 rounded-lg bg-white`}
              >
                Login
              </NavLink>
            )}
          </li>

          {!userInfo ? (
            <li>
              <NavLink
                to={"/sign-up"}
                className={`outline-none text-center font-semibold px-4 py-1.5 rounded-lg bg-amber-400`}
              >
                Register
              </NavLink>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
