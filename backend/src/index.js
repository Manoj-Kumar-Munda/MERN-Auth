import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: ".env",
});

connectDB()
  .then(() => {})
  .catch((err) => {
    console.error("Mongo DB connection failed ", err);
  });

app.listen(process.env.PORT || 8000, () => {
  console.log(`server is running at port ${process.env.PORT}`);
});
