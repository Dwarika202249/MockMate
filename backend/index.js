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

// Background job: release stale credit reservations (run every 10 minutes)
const { releaseStaleReservations } = require('./utils/creditManager');
const RESERVATION_TTL_MIN = parseInt(process.env.RESERVATION_TTL_MIN || '60', 10);
setInterval(() => {
  releaseStaleReservations(RESERVATION_TTL_MIN).catch(err => console.error('Error running stale reservation release job:', err));
}, 10 * 60 * 1000);

app.use(cors());

// Allow popups to communicate via postMessage (needed for OAuth popups)
app.use((req, res, next) => {
  // Allow popup windows to use window.postMessage back to the opener
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Leave COEP unset (default/unsafe-none) unless you intentionally need it
  next();
});

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume-parser', resumeParserRoute);
app.use('/api/credits', creditsRoutes);
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/quizzes', require('./routes/quiz'));

//mongodb connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
