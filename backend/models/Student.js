import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration / ID number is required"],
      trim: true,
      uppercase: true,
      index: true,
    },
    studentId: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "staff", "faculty"],
      default: "student",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
    section: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    academicYear: {
      type: String,
      trim: true,
      default: "",
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: "",
    },
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      default: "College of Engineering",
    },
    collegeAddress: {
      type: String,
      trim: true,
      default: "",
    },
    collegeWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    collegeContact: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      type: String, // Base64 data URL or external URL
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    signature: {
      type: String,
      default: null,
    },
    hodSignature: {
      type: String,
      default: null,
    },
    template: {
      type: String,
      enum: ["modern", "classic", "minimal", "vanguard", "metro", "oxford"],
      default: "modern",
    },
    themeColor: {
      type: String,
      default: "#1d4ed8",
    },
    orientation: {
      type: String,
      enum: ["horizontal", "vertical"],
      default: "horizontal",
    },
    verificationToken: {
      type: String,
      default: () => "VERIFIED-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
  },
  {
    timestamps: true,
  },
);

// Prevent overwrite model compilation error during hot reloads
export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
