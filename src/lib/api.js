/**
 * Client API service for MongoDB / Backend connectivity
 */
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "");
/**
 * Check backend and MongoDB connection status
 */
export async function checkDbHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      return { connected: false, statusText: "API unreachable" };
    }
    const data = await res.json();
    const isDbConnected = data.database?.connected || data.database?.state === 1;
    return {
      connected: isDbConnected,
      statusText: isDbConnected ? "MongoDB Connected" : "Local Mode (No DB)",
      details: data,
    };
  } catch {
    return { connected: false, statusText: "Server Offline (Using Local Storage)" };
  }
}
/**
 * Save or update student ID card in MongoDB
 */
export async function saveStudentToDb(student) {
  try {
    const res = await fetch(`${API_BASE}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      // Also cache in localStorage for fast retrieval
      syncToLocalCache(result.data || student);
      return {
        success: true,
        message: result.message || "Saved to MongoDB successfully!",
        data: result.data,
      };
    }
    throw new Error(result.message || "Failed to save to database");
  } catch (err) {
    // If backend is offline, save to localStorage
    syncToLocalCache(student);
    const errorMessage = err instanceof Error ? err.message : "Saved locally";
    return {
      success: true,
      message: `Saved to local storage (${errorMessage})`,
      data: student,
    };
  }
}
/**
 * Retrieve all saved cards from MongoDB
 */
export async function fetchStudentsFromDb() {
  try {
    const res = await fetch(`${API_BASE}/api/students`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch {
    // Fall back to local storage
  }
  return getFromLocalCache();
}
/**
 * Delete a student ID card by MongoDB _id or registration number
 */
export async function deleteStudentFromDb(id, regNo) {
  try {
    const res = await fetch(`${API_BASE}/api/students/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      removeFromLocalCache(id, regNo);
      return true;
    }
  } catch {
    // Fallback delete from local cache
    removeFromLocalCache(id, regNo);
    return true;
  }
  return false;
}
/**
 * Verify student by Registration Number
 */
export async function verifyStudentInDb(regNo) {
  try {
    const res = await fetch(`${API_BASE}/api/students/verify/${encodeURIComponent(regNo)}`);
    return await res.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification request failed";
    return { verified: false, message: msg };
  }
}
// Local storage backup utilities
const LOCAL_STORAGE_KEY = "saved_student_id_cards";
function getFromLocalCache() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function syncToLocalCache(student) {
  if (typeof window === "undefined") return;
  try {
    const current = getFromLocalCache();
    const regNo = student.registrationNumber;
    const filtered = current.filter((s) => s.registrationNumber !== regNo);
    filtered.unshift(student);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }
}
function removeFromLocalCache(id, regNo) {
  if (typeof window === "undefined") return;
  try {
    const current = getFromLocalCache();
    const updated = current.filter(
      (s) => s._id !== id && (regNo ? s.registrationNumber !== regNo : true),
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Local storage delete error:", e);
  }
}
