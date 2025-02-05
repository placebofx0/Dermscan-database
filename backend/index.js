const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user.route");
const subjectRoutes = require("./routes/subject.route")
const studyRoutes = require("./routes/study.route")
const relationRoutes = require("./routes/relation.route")


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

// Routes
app.use("/", userRoutes);
app.use("/", subjectRoutes);
app.use("/", studyRoutes);
app.use("/", relationRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});