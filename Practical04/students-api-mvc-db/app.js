const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");
// Load environment variables
dotenv.config();

const studentController = require("./controllers/studentController");
const {
  validateStudent,
  validateStudentId,
} = require("./middlewares/studentValidation"); // import Student Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;


// ... other requires and app setup ...

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ensure extended is true for urlencoded

// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// ... your API routes (e.g.,

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes for students
// Link specific URL paths to the corresponding controller functions
app.get("/students", studentController.getAllStudents);
app.get("/students/:id", validateStudentId, studentController.getStudentById);
app.post("/students", validateStudent, studentController.createStudent);
app.put(
  "/students/:id",
  validateStudentId,
  validateStudent,
  studentController.updateStudent
);
app.delete("/students/:id", validateStudentId, studentController.deleteStudent);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
// Listen for termination signals (like Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Close any open connections
  await sql.close();
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});