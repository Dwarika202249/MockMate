const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const interviewRoutes = require('./routes/interview');
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use('/api/interview', interviewRoutes);

//mongodb connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
