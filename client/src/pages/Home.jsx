import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { userInfo }= useSelector((state) => state.auth);

  const User = userInfo?.User

  console.log(userInfo);

  return(
  <div>
    Home
    <div>
      { User ? (<h1>{JSON.stringify(User)}</h1>) : null}
    </div>
  </div>);
};

export default Home;
