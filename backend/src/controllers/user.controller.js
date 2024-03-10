import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = async (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  try {
    if (!username) {
      throw new ApiError(403, "Username is required");
    }

    if (!email) {
      throw new ApiError(403, "Email is required");
    }
    //check if the user already existed

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with username or email already exists");
    }

    const user = await User.create({
      fullName: fullName || "",
      username: username.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      " -password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  console.log("Login...", req.body);
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail) {
      throw new ApiError(403, "Username or email is required");
    }

    if (!password) {
      throw new ApiError(403, "Password is required");
    }
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      throw new ApiError(404, "No user found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Password mismatch");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24*60*60*1000, //1day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30*24*60*60*1000
    });

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          User: loggedInUser,
        },
        "User logged in successfully "
      )
    );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
};

const refreshAccessToken = async (req, res, next) => {
  console.log("Refresh token");
  
  const incominRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;


  console.log("incom re token ",incominRefreshToken);
  try {
    if (!incominRefreshToken) {
      throw new ApiError(401, "Unauthorized requests");
    }

    const decodedToken = jwt.verify(
      incominRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incominRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

   

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 1000, //1day
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 1000,
    });

    return res.json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "AccessToken refreshed"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    console.log(user);

    res.status(200).json(
      new ApiResponse(200, {
        user: user,
      })
    );
  } catch (error) {
    next(error);
  }
};
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
