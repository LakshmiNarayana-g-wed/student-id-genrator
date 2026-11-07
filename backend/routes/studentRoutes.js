import { Router } from "express";
import { Student } from "../models/Student.js";
import { getDbStatus } from "../config/db.js";

const router = Router();

// In-memory fallback cache when MongoDB is offline / connecting
const inMemoryCache = new Map();

// Helper to determine if Mongoose is ready
const isMongooseReady = () => getDbStatus().state === 1;

/**
 * @route   GET /api/health
 * @desc    Check system health and MongoDB connectivity status
 */
router.get("/health", (req, res) => {
  const status = getDbStatus();
  return res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Student ID Card Generator API",
    database: status,
  });
});

/**
 * @route   GET /api/students
 * @desc    Fetch all saved student ID cards
 */
router.get("/students", async (req, res) => {
  try {
    if (isMongooseReady()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: students.length, data: students, source: "mongodb" });
    }

    // Fallback to cache if DB not connected
    const cachedStudents = Array.from(inMemoryCache.values()).reverse();
    return res.json({
      success: true,
      count: cachedStudents.length,
      data: cachedStudents,
      source: "memory_fallback",
      notice: "MongoDB not connected. Data served from local memory.",
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/students
 * @desc    Create or update a student ID card record
 */
router.post("/students", async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.studentName) {
      return res.status(400).json({ success: false, message: "Student name is required." });
    }

    const regNo = (studentData.registrationNumber || studentData.studentId || "")
      .trim()
      .toUpperCase();
    if (!regNo) {
      return res
        .status(400)
        .json({ success: false, message: "Registration number or ID is required." });
    }

    studentData.registrationNumber = regNo;

    if (isMongooseReady()) {
      // Upsert: update existing student record or insert a new one
      const student = await Student.findOneAndUpdate(
        { registrationNumber: regNo },
        { ...studentData },
        { new: true, upsert: true, runValidators: true },
      );

      // Keep cache updated
      inMemoryCache.set(regNo, student.toObject());

      return res.status(201).json({
        success: true,
        message: "Student ID card saved to MongoDB successfully!",
        data: student,
        source: "mongodb",
      });
    }

    // In-memory fallback
    const mockId = "mock_" + Date.now();
    const fallbackRecord = {
      _id: mockId,
      ...studentData,
      verificationToken: "VERIFIED-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryCache.set(regNo, fallbackRecord);

    return res.status(201).json({
      success: true,
      message:
        "Student ID card saved (Memory fallback active - configure MONGODB_URI for cloud persistence).",
      data: fallbackRecord,
      source: "memory_fallback",
    });
  } catch (error) {
    console.error("Error saving student:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/students/verify/:regNo
 * @desc    Verify student credentials via registration number (used for QR verification)
 */
router.get("/students/verify/:regNo", async (req, res) => {
  try {
    const regNo = req.params.regNo.trim().toUpperCase();

    if (isMongooseReady()) {
      const student = await Student.findOne({ registrationNumber: regNo });
      if (student) {
        return res.json({
          verified: true,
          status: "Official Record Found",
          data: student,
        });
      }
    } else if (inMemoryCache.has(regNo)) {
      return res.json({
        verified: true,
        status: "Official Record Found (Local)",
        data: inMemoryCache.get(regNo),
      });
    }

    return res.status(404).json({
      verified: false,
      status: "Record Not Found",
      message: `No active student record registered with ID ${regNo}.`,
    });
  } catch (error) {
    return res.status(500).json({ verified: false, message: error.message });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Get a specific student record by ID
 */
router.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ success: false, message: "Record not found." });
      }
      return res.json({ success: true, data: student });
    }

    const cached = Array.from(inMemoryCache.values()).find((s) => s._id === id);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    return res.status(404).json({ success: false, message: "Record not found." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student record
 */
router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      const deleted = await Student.findByIdAndDelete(id);
      if (deleted) {
        inMemoryCache.delete(deleted.registrationNumber);
        return res.json({ success: true, message: "Card deleted from MongoDB successfully." });
      }
    }

    // Try deleting from cache
    for (const [key, value] of inMemoryCache.entries()) {
      if (value._id === id) {
        inMemoryCache.delete(key);
        return res.json({ success: true, message: "Card deleted successfully." });
      }
    }

    return res.status(404).json({ success: false, message: "Record not found." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
