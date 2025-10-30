const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const apiRouter = require("./routes");
const connectDb = require("./config/dbConnection");
const globalErrorHandler = require("./utilities/errorHandlings/globalErrorHandler");
const AppError = require("./utilities/errorHandlings/appError");
const job = require("./utilities/cronJobs");
require("dotenv").config();

const app = express();

//Database connection
connectDb();

// In serverless environments (like Vercel), cron jobs are not supported.
// Skip starting the cron when running on Vercel to prevent function crashes.
if (!process.env.VERCEL) {
  job.start();
}
//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5173",
      // Add your deployed domains below
      process.env.ALLOWED_ORIGIN_1,
      process.env.ALLOWED_ORIGIN_2,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Server Started succesfully");
});

//routes
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

// If not running on Vercel, start the server normally.
// On Vercel, export the app as a handler for the serverless function.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5001;
  app.listen(port, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`server starts on port ${port}`);
    }
  });
}

module.exports = app;
