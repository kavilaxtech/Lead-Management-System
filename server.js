const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const leadRoutes = require("./routes/leads");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/leads", leadRoutes);

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log(" LeadFlow Server Started");
    console.log(` Running on http://localhost:${PORT}`);
    console.log("=================================");
});