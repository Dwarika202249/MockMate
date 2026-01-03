const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require('http');
const authRoutes = require("./routes/auth");
const interviewRoutes = require('./routes/interview');
const resumeParserRoute = require('./routes/resumeParser');
const creditsRoutes = require('./routes/credits');
const setupWebSocket = require('./utils/websocket');
const setupWorkers = require('./workers');
const cors = require("cors");

dotenv.config();
const app = express();
const server = http.createServer(app);

// Set up WebSocket and Workers
const io = setupWebSocket(server);
setupWorkers();

app.use(cors());

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume-parser', resumeParserRoute);
app.use('/api/credits', creditsRoutes);
app.use('/api/feedback', require('./routes/feedback'));

//mongodb connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
