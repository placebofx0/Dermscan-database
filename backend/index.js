const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user.routes");
const subjectRoutes = require("./routes/subject.route")
const studyRoutes = require("./routes/study.routes")
const bodyParser = require("body-parser");

dotenv.config();

const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error("MONGO_URI is not defined in the .env file");
  }

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoutes);
app.use("/subjects", subjectRoutes);
app.use("/studies", studyRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});