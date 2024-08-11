const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
