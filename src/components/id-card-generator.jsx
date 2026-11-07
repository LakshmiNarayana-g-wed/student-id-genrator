import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  FileDown,
  GraduationCap,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Printer,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  RotateCw,
  Columns,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderHeart,
  Search,
  Trash2,
  ExternalLink,
  Moon,
  Sun,
  Sparkles,
  Award,
  Layers,
  Palette,
  Eye,
  Check,
  X,
  UserCheck,
  Briefcase,
  IdCard as IdCardIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  saveStudentToDb,
  fetchStudentsFromDb,
  deleteStudentFromDb,
  verifyStudentInDb,
  checkDbHealth,
} from "@/lib/api";

// Sample Vector Presets for instant 1-click test
const PRESET_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240"><rect width="200" height="240" fill="%23e2e8f0"/><circle cx="100" cy="80" r="45" fill="%233b82f6"/><ellipse cx="100" cy="195" rx="70" ry="50" fill="%231e293b"/><path d="M75 145 L100 185 L125 145 Z" fill="%23ffffff"/><circle cx="100" cy="72" r="32" fill="%23fed7aa"/><path d="M68 62 C68 40 132 40 132 62 C132 50 115 42 100 42 C85 42 68 50 68 62 Z" fill="%231e293b"/><circle cx="88" cy="70" r="3" fill="%23334155"/><circle cx="112" cy="70" r="3" fill="%23334155"/><path d="M92 84 Q100 90 108 84" stroke="%23334155" stroke-width="2" fill="none"/></svg>`;

const PRESET_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="%231e3a8a" stroke="%23fbbf24" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="%23fbbf24" stroke-width="1" stroke-dasharray="3,2"/><path d="M50 22 L72 35 L72 65 L50 78 L28 65 L28 35 Z" fill="%23ffffff" stroke="%23fbbf24" stroke-width="2"/><path d="M50 28 L66 38 L66 60 L50 70 L34 60 L34 38 Z" fill="%231e3a8a"/><polygon points="50,34 54,44 64,44 56,50 59,60 50,54 41,60 44,50 36,44 46,44" fill="%23fbbf24"/><path d="M42 66 Q50 62 58 66" stroke="%23ffffff" stroke-width="2" fill="none"/></svg>`;

const PRESET_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><path d="M10 35 Q30 5 45 25 T80 15 Q100 35 120 18 T150 25 M30 38 L140 38" stroke="%231e293b" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;

const PRESET_HOD_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><path d="M15 20 Q35 40 50 15 T85 30 Q110 5 130 25 T155 15 M20 42 L135 42" stroke="%231e293b" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;

const sampleData = {
  studentName: "Aarav Sharma",
  studentId: "STU-2026-0842",
  registrationNumber: "22BCE10482",
  department: "Computer Science & Engineering",
  year: "3rd Year",
  section: "Section B",
  dateOfBirth: "2004-08-15",
  bloodGroup: "O+",
  phone: "+91 98765 43210",
  email: "aarav.sharma@apex-edu.in",
  address: "Flat 402, Royal Residency, Silicon Valley Blvd, Tech City",
  academicYear: "2024–2028",
  emergencyContact: "+91 91234 56789",
  collegeName: "Apex Institute of Science & Technology",
  collegeAddress: "Knowledge Valley Campus, Sector 9, Cyber City - 560001",
  collegeWebsite: "www.apex-tech.edu.in",
  collegeContact: "+91 80 2899 4400",
};

const initialData = {
  studentName: "",
  studentId: "",
  registrationNumber: "",
  department: "",
  year: "",
  section: "",
  dateOfBirth: "",
  bloodGroup: "",
  phone: "",
  email: "",
  address: "",
  academicYear: "",
  emergencyContact: "",
  collegeName: "",
  collegeAddress: "",
  collegeWebsite: "",
  collegeContact: "",
};

const studentFields = [
  { key: "studentName", label: "Student Name", placeholder: "e.g. Aarav Sharma", required: true },
  {
    key: "registrationNumber",
    label: "Registration No.",
    placeholder: "e.g. 22BCE10482",
    required: true,
  },
  {
    key: "department",
    label: "Department / Branch",
    placeholder: "e.g. Computer Science",
    required: true,
  },
  { key: "year", label: "Academic Year / Class", placeholder: "e.g. 3rd Year", required: true },
  { key: "section", label: "Section / Batch", placeholder: "e.g. Section B" },
  { key: "dateOfBirth", label: "Date of Birth", placeholder: "", type: "date" },
  { key: "bloodGroup", label: "Blood Group", placeholder: "e.g. O+, B+, A+" },
  { key: "phone", label: "Mobile Number", placeholder: "e.g. +91 98765 43210", type: "tel" },
  { key: "email", label: "Student Email", placeholder: "e.g. aarav@campus.edu", type: "email" },
  {
    key: "academicYear",
    label: "Card Validity / Batch",
    placeholder: "e.g. 2024–2028",
    required: true,
  },
  {
    key: "emergencyContact",
    label: "Emergency Contact",
    placeholder: "e.g. +91 91234 56789",
    type: "tel",
  },
];

const collegeFields = [
  {
    key: "collegeName",
    label: "College / University Name",
    placeholder: "e.g. Apex Institute of Technology",
    required: true,
  },
  { key: "collegeWebsite", label: "Campus Website", placeholder: "e.g. www.apex-tech.edu.in" },
  {
    key: "collegeContact",
    label: "Campus Helpline",
    placeholder: "e.g. +91 80 2899 4400",
    type: "tel",
  },
];

const templates = [
  {
    id: "modern",
    name: "Modern",
    detail: "Bold dual-tone header with clean typography",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    id: "classic",
    name: "Classic",
    detail: "Formal double-border institutional crest style",
    accent: "from-amber-700 to-yellow-600",
  },
  {
    id: "minimal",
    name: "Minimal",
    detail: "Clean, architectural Swiss monochrome layout",
    accent: "from-slate-700 to-slate-900",
  },
  {
    id: "vanguard",
    name: "Vanguard Split",
    detail: "High-contrast split panel with bold monogram",
    accent: "from-blue-900 to-indigo-950",
  },
  {
    id: "metro",
    name: "Metro Lanyard",
    detail: "Centered vertical pass with slot punch bar",
    accent: "from-slate-900 to-blue-900",
  },
  {
    id: "oxford",
    name: "Oxford Crest",
    detail: "Prestigious framed certificate with serif type",
    accent: "from-slate-800 to-zinc-900",
  },
];

const themeColors = [
  { name: "Royal Blue", value: "#1d4ed8" },
  { name: "Emerald Forest", value: "#0f766e" },
  { name: "Royal Amethyst", value: "#6d28d9" },
  { name: "Crimson Rose", value: "#be123c" },
  { name: "Obsidian Slate", value: "#0f172a" },
  { name: "Warm Amber", value: "#d97706" },
  { name: "Cyber Teal", value: "#0284c7" },
];

function Field({ field, value, error, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={field.key}
        className="text-xs font-semibold text-foreground/90 flex items-center justify-between"
      >
        <span>
          {field.label} {field.required && <span className="text-destructive">*</span>}
        </span>
      </Label>
      <Input
        id={field.key}
        type={field.type ?? "text"}
        value={value || ""}
        maxLength={field.type === "email" ? 120 : 80}
        placeholder={field.placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-9 text-sm transition-all focus-visible:ring-1",
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input/70 focus-visible:ring-primary",
        )}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Logo({ src }) {
  return src ? (
    <img src={src} alt="College crest" className="h-full w-full object-contain" />
  ) : (
    <GraduationCap className="h-8 w-8 text-primary" aria-hidden="true" />
  );
}

function Avatar({ src }) {
  return src ? (
    <img src={src} alt="Portrait photo" className="h-full w-full object-cover" />
  ) : (
    <UserRound className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
  );
}

// Visual ID Card component supporting both Front and Back sides
function IDCardFace({
  data,
  role,
  template,
  orientation,
  side,
  photo,
  logo,
  signature,
  hodSignature,
  themeColor,
  cardRef,
}) {
  const roleName = role === "student" ? "Student" : role === "staff" ? "Staff" : "Faculty";
  const qrValue = JSON.stringify({
    name: data.studentName || "Student",
    id: role === "student" ? data.registrationNumber || "22BCE10482" : data.studentId || "EMP-001",
    department: data.department || "General",
    institution: data.collegeName || "Institution",
    valid: data.academicYear || "2024–2028",
  });

  return (
    <div
      ref={cardRef}
      style={{ "--card-accent": themeColor }}
      className={cn(
        "id-card",
        "id-card--themed",
        `id-card--${template}`,
        `id-card--${orientation}`,
        "relative select-none",
      )}
    >
      <div className="pvc-gloss-overlay" />
      {side === "front" ? (
        template === "oxford" ? (
          <div className="id-card__face id-card__oxford">
            <header className="id-card__oxford-header">
              <h2>{data.collegeName || "Institution Name"}</h2>
              <p>{data.collegeWebsite || "Established for Academic Excellence"}</p>
              <strong>OFFICIAL IDENTITY CERTIFICATE</strong>
            </header>
            <div className="id-card__oxford-photo">
              <Avatar src={photo} />
            </div>
            <div className="id-card__oxford-name">
              <h3>{data.studentName || `${roleName} Name`}</h3>
              <p>
                {role === "student"
                  ? `${data.year || "Class"} — Batch ${data.section || "A"}`
                  : data.department || "Department"}
              </p>
            </div>
            <div className="id-card__oxford-details">
              <div>
                <span>{role === "student" ? "Registration No:" : `${roleName} ID:`}</span>
                <strong>
                  {role === "student"
                    ? data.registrationNumber || "Reg. Number"
                    : data.studentId || "ID Number"}
                </strong>
              </div>
              <div>
                <span>{role === "student" ? "Blood Group:" : "Department:"}</span>
                <strong>
                  {role === "student" ? data.bloodGroup || "—" : data.department || "—"}
                </strong>
              </div>
              <div>
                <span>Emergency:</span>
                <strong>{data.emergencyContact || data.phone || "—"}</strong>
              </div>
            </div>
            <footer className="id-card__oxford-footer">
              <div>
                <strong>Authorized Signatory</strong>
                <span>{data.academicYear || "Academic Validity"}</span>
              </div>
              <QRCodeSVG value={qrValue} size={54} level="M" bgColor="white" fgColor="#17233c" />
            </footer>
          </div>
        ) : template === "metro" ? (
          <div className="id-card__face id-card__metro">
            <div className="id-card__metro-slot" />
            <header className="id-card__metro-header">
              <h2>{data.collegeName || "College Name"}</h2>
              <p>
                {roleName.toUpperCase()} PASS {data.academicYear || "2024–28"}
              </p>
            </header>
            <div className="id-card__metro-photo">
              <Avatar src={photo} />
            </div>
            <div className="id-card__metro-name">
              <h3>{data.studentName || `${roleName} Name`}</h3>
              <p>
                {role === "student"
                  ? `${data.year || "Class"} — Batch ${data.section || "A"}`
                  : data.department || "Department"}
              </p>
            </div>
            <div className="id-card__metro-details">
              <div>
                <span>
                  {role === "student" ? "REGISTRATION NO" : `${roleName.toUpperCase()} ID`}
                </span>
                <strong>
                  {role === "student"
                    ? data.registrationNumber || "Reg Number"
                    : data.studentId || "ID Number"}
                </strong>
              </div>
              <div>
                <span>{role === "student" ? "BLOOD" : "DEPARTMENT"}</span>
                <strong>
                  {role === "student" ? data.bloodGroup || "—" : data.department || "—"}
                </strong>
              </div>
              <div>
                <span>{role === "student" ? "VALIDITY" : "PHONE"}</span>
                <strong>{role === "student" ? data.academicYear || "—" : data.phone || "—"}</strong>
              </div>
            </div>
            <footer className="id-card__metro-footer">
              <div>
                <span>EMERGENCY HELPLINE</span>
                <strong>{data.emergencyContact || data.phone || "—"}</strong>
              </div>
              <QRCodeSVG value={qrValue} size={52} level="M" bgColor="white" fgColor="#10182d" />
            </footer>
          </div>
        ) : template === "vanguard" ? (
          <div className="id-card__face id-card__vanguard">
            <header className="id-card__vanguard-header">
              <div>
                <h2>{data.collegeName || "Institution Name"}</h2>
                <p>{data.collegeWebsite || "Campus Identity"}</p>
              </div>
            </header>
            <div className="id-card__vanguard-rail">{data.collegeWebsite || "OFFICIAL ID"}</div>
            <div className="id-card__vanguard-name">
              <h3>{data.studentName || `${roleName} Name`}</h3>
              <p>
                {role === "student"
                  ? `${data.year || "CLASS"} — BATCH ${data.section || "A"}`
                  : data.department || "DEPARTMENT"}
              </p>
            </div>
            <div className="id-card__vanguard-split">
              <div className="id-card__vanguard-details">
                <div>
                  <span>
                    {role === "student" ? "REGISTRATION NO." : `${roleName.toUpperCase()} ID`}
                  </span>
                  <strong>
                    {role === "student"
                      ? data.registrationNumber || "Registration No"
                      : data.studentId || "ID Number"}
                  </strong>
                </div>
                <div>
                  <span>{role === "student" ? "BLOOD GRP" : "DEPARTMENT"}</span>
                  <strong>
                    {role === "student" ? data.bloodGroup || "—" : data.department || "—"}
                  </strong>
                </div>
                <div>
                  <span>{role === "student" ? "VALIDITY" : "PHONE"}</span>
                  <strong>
                    {role === "student" ? data.academicYear || "—" : data.phone || "—"}
                  </strong>
                </div>
                <QRCodeSVG value={qrValue} size={58} level="M" bgColor="white" fgColor="#10182d" />
              </div>
              <div className="id-card__vanguard-panel">
                {photo ? (
                  <img src={photo} alt="Student" className="h-full w-full object-cover" />
                ) : (
                  <span>{(data.studentName || roleName).trim().charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="id-card__face">
            <header className="id-card__header">
              <div className="id-card__logo">
                <Logo src={logo} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="id-card__college">{data.collegeName || "Institution Name"}</p>
                <p className="id-card__website">{data.collegeWebsite || "www.institution.edu"}</p>
              </div>
            </header>
            <div className="id-card__title">{roleName.toUpperCase()} IDENTIFICATION</div>
            <div className="id-card__content">
              <div className="id-card__portrait">
                <Avatar src={photo} />
              </div>
              <div className="id-card__identity">
                <h2>{data.studentName || `${roleName} Name`}</h2>
                <p className="id-card__id">
                  {role === "student"
                    ? data.registrationNumber || "Reg: 22BCE10482"
                    : data.studentId || `${roleName.toUpperCase()} ID`}
                </p>
                <dl>
                  <div>
                    <dt>Branch</dt>
                    <dd>{data.department || "—"}</dd>
                  </div>
                  <div>
                    <dt>Year / Sec</dt>
                    <dd>
                      {data.year || "—"} {data.section && `• ${data.section}`}
                    </dd>
                  </div>
                  <div>
                    <dt>Blood</dt>
                    <dd>{data.bloodGroup || "—"}</dd>
                  </div>
                  <div>
                    <dt>Valid</dt>
                    <dd>{data.academicYear || "—"}</dd>
                  </div>
                </dl>
              </div>
              <div className="id-card__qr">
                <QRCodeSVG
                  value={qrValue}
                  size={68}
                  level="M"
                  bgColor="transparent"
                  fgColor="currentColor"
                />
                <span>SCAN TO VERIFY</span>
              </div>
            </div>
            <footer className="id-card__footer">
              <span>
                <Phone className="h-2.5 w-2.5" /> {data.phone || "—"}
              </span>
              <span>
                <Mail className="h-2.5 w-2.5" /> {data.email || "—"}
              </span>
            </footer>
          </div>
        )
      ) : (
        <div className="id-card__face id-card__back">
          <header className="id-card__back-header">
            <div className="id-card__logo">
              <Logo src={logo} />
            </div>
            <div>
              <p>{data.collegeName || "Institution Name"}</p>
              <span>{roleName.toUpperCase()} TERMS & CONDITIONS</span>
            </div>
          </header>
          <div className="id-card__back-body">
            <div className="id-card__address">
              <MapPin />
              <div>
                <strong>{role === "student" ? "College Campus Address" : "Address"}</strong>
                <p>
                  {role === "student"
                    ? data.collegeAddress || "Campus address details"
                    : data.address || "Residential address"}
                </p>
              </div>
            </div>
            {role !== "student" && (
              <div className="id-card__address">
                <MapPin />
                <div>
                  <strong>Campus Address</strong>
                  <p>{data.collegeAddress || "Campus address details"}</p>
                </div>
              </div>
            )}
            <div className="id-card__emergency">
              <ShieldCheck />
              <div>
                <span>IN CASE OF EMERGENCY</span>
                <strong>{data.emergencyContact || data.phone || "—"}</strong>
              </div>
            </div>
            <div className="id-card__instructions">
              <strong>Institutional Policy</strong>
              <ol>
                <li>This card is non-transferable and remains property of the issuing campus.</li>
                <li>Must be worn visibly while on institutional premises.</li>
                <li>If found, kindly return to the Office of the Registrar.</li>
              </ol>
            </div>
            <div className="id-card__signature">
              <div>
                {signature ? (
                  <img src={signature} alt="Authorized Signatory" />
                ) : (
                  <span className="id-card__signature-mark">M. Rao</span>
                )}
                <p>Authorized Signatory</p>
              </div>
              <div>
                {hodSignature ? (
                  <img src={hodSignature} alt="HOD Sign" />
                ) : (
                  <span className="id-card__signature-mark">HOD</span>
                )}
                <p>Head of Department</p>
              </div>
              <div className="id-card__contact">
                <Phone className="h-2 w-2 inline" /> {data.collegeContact || "—"}
                <br />
                {data.collegeWebsite}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function IDCardGenerator() {
  const [data, setData] = useState(sampleData);
  const [role, setRole] = useState("student");
  const [template, setTemplate] = useState("modern");
  const [themeColor, setThemeColor] = useState("#1d4ed8");
  const [orientation, setOrientation] = useState("horizontal");
  const [side, setSide] = useState("front");
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState("interactive"); // "interactive" | "split"
  const [showLanyard, setShowLanyard] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "college" | "media" | "style"
  const [photo, setPhoto] = useState(PRESET_PHOTO);
  const [logo, setLogo] = useState(PRESET_LOGO);
  const [signature, setSignature] = useState(PRESET_SIGNATURE);
  const [hodSignature, setHodSignature] = useState(PRESET_HOD_SIGNATURE);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyRegNo, setVerifyRegNo] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, text: "Checking DB..." });

  const cardRefFront = useRef(null);
  const cardRefBack = useRef(null);
  const cardRefSingle = useRef(null);

  // Synchronize dark mode class with state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Initial DB health & saved cards sync
  useEffect(() => {
    async function initDb() {
      const health = await checkDbHealth();
      setDbStatus({ connected: health.connected, text: health.statusText });
      const cards = await fetchStudentsFromDb();
      setSavedCards(cards);
    }
    initDb();
  }, []);

  const roleFields =
    role === "student"
      ? studentFields
      : [
          {
            key: "studentName",
            label: `${role === "staff" ? "Staff" : "Faculty"} Full Name`,
            placeholder: `Enter ${role} name`,
            required: true,
          },
          {
            key: "studentId",
            label: `${role === "staff" ? "Staff" : "Faculty"} Employee ID`,
            placeholder: `Enter employee ID`,
            required: true,
          },
          {
            key: "department",
            label: "Department / Division",
            placeholder: "Enter department",
            required: true,
          },
          { key: "phone", label: "Contact Phone", placeholder: "Enter phone number", type: "tel" },
          {
            key: "email",
            label: "Official Email",
            placeholder: "Enter official email",
            type: "email",
          },
          {
            key: "academicYear",
            label: "Validity / Expiry",
            placeholder: "e.g. 2026–2030",
            required: true,
          },
        ];

  const updateField = (key, value) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleUpload = (setter, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Please upload a JPG, PNG, or WebP image under 5 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setter(typeof reader.result === "string" ? reader.result : null);
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const loadSampleData = () => {
    setData(sampleData);
    setPhoto(PRESET_PHOTO);
    setLogo(PRESET_LOGO);
    setSignature(PRESET_SIGNATURE);
    setHodSignature(PRESET_HOD_SIGNATURE);
    setErrors({});
    toast.success("Sample campus student data loaded!");
  };

  const validate = () => {
    const next = {};
    [...roleFields, ...(role === "student" ? collegeFields : [collegeFields[0]])].forEach(
      (field) => {
        if (field.required && !data[field.key]?.trim()) {
          next[field.key] = `${field.label} is required.`;
        }
      },
    );
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fill in the required fields marked in red.");
      return false;
    }
    return true;
  };

  const renderTargetPng = async (element) => {
    if (!element) return null;
    return await toPng(element, { pixelRatio: 3, cacheBust: true });
  };

  const downloadPng = async () => {
    if (!validate()) return;
    const targetElement = isFlipped
      ? cardRefBack.current || cardRefSingle.current
      : cardRefFront.current || cardRefSingle.current;
    if (!targetElement) return;

    toast.loading("Generating crisp 3x PNG export...", { id: "export" });
    try {
      const image = await renderTargetPng(targetElement);
      if (!image) throw new Error("Rendering failed");

      const link = document.createElement("a");
      const idCode = (role === "student" ? data.registrationNumber : data.studentId) || role;
      link.download = `${idCode}-${isFlipped ? "back" : "front"}-id-card.png`;
      link.href = image;
      link.click();
      toast.success("PNG downloaded successfully!", { id: "export" });
    } catch {
      toast.error("Could not generate PNG export. Please try again.", { id: "export" });
    }
  };

  const downloadPdf = async () => {
    if (!validate()) return;
    toast.loading("Generating print-calibrated PDF...", { id: "export" });
    try {
      const frontElem = cardRefFront.current || cardRefSingle.current;
      if (!frontElem) throw new Error("Card element unavailable");

      const imageFront = await renderTargetPng(frontElem);
      if (!imageFront) throw new Error("Could not render front");

      const isLandscape = orientation === "horizontal";
      const width = isLandscape ? 85.6 : 54;
      const height = isLandscape ? 54 : 85.6;

      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: [width, height],
      });

      pdf.addImage(imageFront, "PNG", 0, 0, width, height);

      // Add back side page if back exists
      const backElem = cardRefBack.current;
      if (backElem) {
        const imageBack = await renderTargetPng(backElem);
        if (imageBack) {
          pdf.addPage([width, height], isLandscape ? "landscape" : "portrait");
          pdf.addImage(imageBack, "PNG", 0, 0, width, height);
        }
      }

      const idCode = (role === "student" ? data.registrationNumber : data.studentId) || role;
      pdf.save(`${idCode}-official-id-card.pdf`);
      toast.success("CR80 PVC-Ready PDF downloaded!", { id: "export" });
    } catch {
      toast.error("Failed to generate PDF. Please try again.", { id: "export" });
    }
  };

  const handleSaveToDatabase = async () => {
    if (!validate()) return;
    setIsSaving(true);
    toast.loading("Saving card to database...", { id: "db-save" });

    const cardPayload = {
      ...data,
      role,
      template,
      themeColor,
      orientation,
      photo,
      logo,
      signature,
      hodSignature,
    };

    const res = await saveStudentToDb(cardPayload);
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message || "Card saved successfully!", { id: "db-save" });
      const updated = await fetchStudentsFromDb();
      setSavedCards(updated);
    } else {
      toast.error("Failed to save card.", { id: "db-save" });
    }
  };

  const handleDeleteSavedCard = async (id, regNo) => {
    const ok = window.confirm("Are you sure you want to delete this card?");
    if (!ok) return;

    const success = await deleteStudentFromDb(id, regNo);
    if (success) {
      toast.success("Card removed.");
      const updated = await fetchStudentsFromDb();
      setSavedCards(updated);
    } else {
      toast.error("Failed to delete card.");
    }
  };

  const handleLoadSavedCard = (saved) => {
    setData({
      studentName: saved.studentName || "",
      studentId: saved.studentId || "",
      registrationNumber: saved.registrationNumber || "",
      department: saved.department || "",
      year: saved.year || "",
      section: saved.section || "",
      dateOfBirth: saved.dateOfBirth || "",
      bloodGroup: saved.bloodGroup || "",
      phone: saved.phone || "",
      email: saved.email || "",
      address: saved.address || "",
      academicYear: saved.academicYear || "",
      emergencyContact: saved.emergencyContact || "",
      collegeName: saved.collegeName || "",
      collegeAddress: saved.collegeAddress || "",
      collegeWebsite: saved.collegeWebsite || "",
      collegeContact: saved.collegeContact || "",
    });
    if (saved.role) setRole(saved.role);
    if (saved.template) setTemplate(saved.template);
    if (saved.themeColor) setThemeColor(saved.themeColor);
    if (saved.orientation) setOrientation(saved.orientation);
    if (saved.photo !== undefined) setPhoto(saved.photo);
    if (saved.logo !== undefined) setLogo(saved.logo);
    if (saved.signature !== undefined) setSignature(saved.signature);
    if (saved.hodSignature !== undefined) setHodSignature(saved.hodSignature);

    setIsSavedModalOpen(false);
    toast.success(`Loaded "${saved.studentName}" into editor.`);
  };

  const handleVerifyStudent = async (e) => {
    e.preventDefault();
    if (!verifyRegNo.trim()) {
      toast.error("Please enter a registration number.");
      return;
    }
    setIsVerifying(true);
    const result = await verifyStudentInDb(verifyRegNo.trim());
    setIsVerifying(false);
    setVerificationResult(result);
  };

  const reset = () => {
    if (!window.confirm("Reset all fields to blank?")) return;
    setData(initialData);
    setPhoto(null);
    setLogo(null);
    setSignature(null);
    setHodSignature(null);
    setErrors({});
    toast.info("All fields cleared.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 shadow-md shadow-primary/25">
              <IdCardIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight sm:text-lg">
                  ID Studio
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  v2.0
                </span>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Campus Digital Identification Suite
              </p>
            </div>
          </div>

          {/* Role Segmented Pill Control */}
          <div className="hidden md:flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 p-1">
            {[
              { id: "student", label: "Student ID", icon: GraduationCap },
              { id: "faculty", label: "Faculty ID", icon: Award },
              { id: "staff", label: "Staff ID", icon: Briefcase },
            ].map((item) => {
              const Icon = item.icon;
              const active = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRole(item.id);
                    toast.info(`Switched to ${item.label}`);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? "bg-white dark:bg-slate-900 text-foreground shadow-sm shadow-black/5"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadSampleData}
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Quick Fill
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSavedModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium relative"
            >
              <FolderHeart className="h-3.5 w-3.5 text-rose-500" />
              <span className="hidden sm:inline">Saved</span>
              {savedCards.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {savedCards.length}
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVerifyModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Verify</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle dark mode"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher */}
        <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2 justify-around">
          {[
            { id: "student", label: "Student" },
            { id: "faculty", label: "Faculty" },
            { id: "staff", label: "Staff" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRole(item.id)}
              className={cn(
                "px-4 py-1 rounded-md text-xs font-semibold",
                role === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace Studio */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Customization Studio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {/* Studio Tabs Navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 p-1">
                {[
                  { id: "personal", label: "Profile", icon: UserRound },
                  { id: "college", label: "Campus", icon: Building2 },
                  { id: "media", label: "Media & Sign", icon: ImagePlus },
                  { id: "style", label: "Style & Theme", icon: Palette },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all",
                        active
                          ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Profile Details */}
              {activeTab === "personal" && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-sm">
                        {role === "student"
                          ? "Student Information"
                          : `${role === "faculty" ? "Faculty" : "Staff"} Information`}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Fields with * are displayed on card front
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadSampleData}
                      className="h-7 text-xs text-primary"
                    >
                      Fill Sample
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {roleFields.map((field) => (
                      <Field
                        key={field.key}
                        field={field}
                        value={data[field.key]}
                        error={errors[field.key]}
                        onChange={updateField}
                      />
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Label htmlFor="address" className="text-xs font-semibold">
                      Residential Address
                    </Label>
                    <Textarea
                      id="address"
                      maxLength={240}
                      rows={2}
                      value={data.address || ""}
                      placeholder="Enter residential address for back side of card..."
                      className="text-xs resize-none"
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Campus & Institution */}
              {activeTab === "college" && (
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm">Institutional Information</h3>
                    <p className="text-xs text-muted-foreground">
                      Appears on card headers and verification backs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {collegeFields.map((field) => (
                      <Field
                        key={field.key}
                        field={field}
                        value={data[field.key]}
                        error={errors[field.key]}
                        onChange={updateField}
                      />
                    ))}

                    <div className="space-y-1.5">
                      <Label htmlFor="collegeAddress" className="text-xs font-semibold">
                        Campus Physical Address
                      </Label>
                      <Textarea
                        id="collegeAddress"
                        maxLength={240}
                        rows={3}
                        value={data.collegeAddress || ""}
                        placeholder="Enter full campus address with pin code..."
                        className="text-xs resize-none"
                        onChange={(e) => updateField("collegeAddress", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Media & Signatures */}
              {activeTab === "media" && (
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm">Photos, Insignia & Signatures</h3>
                    <p className="text-xs text-muted-foreground">
                      Upload images or choose high-res preset samples
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Student Portrait",
                        id: "photo",
                        state: photo,
                        setter: setPhoto,
                        preset: PRESET_PHOTO,
                        desc: "Passport photo (JPG/PNG)",
                      },
                      {
                        label: "College Crest Logo",
                        id: "logo",
                        state: logo,
                        setter: setLogo,
                        preset: PRESET_LOGO,
                        desc: "Campus insignia badge",
                      },
                      {
                        label: "Authorized Signatory",
                        id: "signature",
                        state: signature,
                        setter: setSignature,
                        preset: PRESET_SIGNATURE,
                        desc: "Principal / Registrar",
                      },
                      {
                        label: "Head of Dept (HOD)",
                        id: "hod-sign",
                        state: hodSignature,
                        setter: setHodSignature,
                        preset: PRESET_HOD_SIGNATURE,
                        desc: "HOD official sign",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{item.label}</span>
                          {item.state && (
                            <button
                              type="button"
                              onClick={() => item.setter(null)}
                              className="text-[11px] text-destructive hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {item.state ? (
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-md border border-slate-200 dark:border-slate-700 bg-white p-1 overflow-hidden flex items-center justify-center">
                              <img
                                src={item.state}
                                alt={item.label}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                              <label
                                htmlFor={item.id}
                                className="cursor-pointer inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                Replace
                              </label>
                              <button
                                type="button"
                                onClick={() => item.setter(item.preset)}
                                className="text-[10px] text-primary hover:underline text-left"
                              >
                                Use Default Vector
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor={item.id}
                              className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-2 py-3 text-center hover:border-primary transition-colors"
                            >
                              <ImagePlus className="h-4 w-4 text-primary" />
                              <span className="text-xs font-medium">Click to upload</span>
                              <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => item.setter(item.preset)}
                              className="mt-1.5 w-full text-center text-[10px] text-primary font-medium hover:underline"
                            >
                              + Load Sample Vector
                            </button>
                          </div>
                        )}
                        <input
                          id={item.id}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(e) => handleUpload(item.setter, e)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Style & Templates */}
              {activeTab === "style" && (
                <div className="p-5 space-y-5">
                  {/* Template Picker */}
                  <div>
                    <h3 className="font-bold text-sm mb-1">Select Card Design Template</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      6 professionally styled layout architectures
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {templates.map((item) => {
                        const active = template === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setTemplate(item.id);
                              if (item.id === "metro" || item.id === "oxford") {
                                setOrientation("vertical");
                              }
                            }}
                            className={cn(
                              "flex flex-col text-left p-2.5 rounded-lg border transition-all text-xs",
                              active
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/40",
                            )}
                          >
                            <div
                              className={cn(
                                "h-8 w-full rounded mb-2 bg-gradient-to-r",
                                item.accent,
                              )}
                            />
                            <strong className="font-bold text-foreground">{item.name}</strong>
                            <small className="text-[10px] text-muted-foreground line-clamp-1">
                              {item.detail}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme Accent Color */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-sm mb-1">Institutional Accent Color</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Used for badges, card headers, and borders
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {themeColors.map((color) => {
                        const active = themeColor === color.value;
                        return (
                          <button
                            key={color.value}
                            type="button"
                            title={color.name}
                            onClick={() => setThemeColor(color.value)}
                            className={cn(
                              "h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110",
                              active && "ring-2 ring-offset-2 ring-primary scale-110",
                            )}
                            style={{ backgroundColor: color.value }}
                          />
                        );
                      })}
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <input
                          type="color"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="h-4 w-4 cursor-pointer rounded-full border-0 bg-transparent p-0"
                        />
                        <span className="font-mono text-[11px] font-semibold">{themeColor}</span>
                      </label>
                    </div>
                  </div>

                  {/* Orientation Switcher */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs">Card Orientation</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Standard CR80 Horizontal vs Vertical
                      </p>
                    </div>
                    <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-1">
                      {["horizontal", "vertical"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setOrientation(item)}
                          className={cn(
                            "px-3 py-1 text-xs font-semibold rounded capitalize transition-all",
                            orientation === item
                              ? "bg-white dark:bg-slate-900 text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Banner */}
            <div className="rounded-xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 flex items-start gap-3 text-xs">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">
                  Live Preview & Automatic Sync
                </p>
                <p className="text-blue-700/80 dark:text-blue-400/80 text-[11px] mt-0.5">
                  All adjustments update immediately on the canvas. Cards export at physical CR80
                  standard dimensions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Card Studio (7 cols) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {/* Studio Canvas Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Interactive 3D Studio</span>
                  <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                    {isFlipped ? "Back View" : "Front View"}
                  </span>
                </div>

                {/* View Mode Controls */}
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant={isFlipped ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-8 gap-1 text-xs font-semibold"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Flip 3D
                  </Button>

                  <Button
                    type="button"
                    variant={viewMode === "split" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(viewMode === "split" ? "interactive" : "split")}
                    className="h-8 gap-1 text-xs font-semibold hidden sm:flex"
                  >
                    <Columns className="h-3.5 w-3.5" />
                    {viewMode === "split" ? "Single View" : "Side-by-Side"}
                  </Button>

                  <Button
                    type="button"
                    variant={showLanyard ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowLanyard(!showLanyard)}
                    className="h-8 gap-1 text-xs font-semibold"
                  >
                    Lanyard
                  </Button>

                  <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-md">
                    <button
                      type="button"
                      onClick={() => setZoom(Math.max(0.75, zoom - 0.1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1 text-muted-foreground">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom(Math.min(1.25, zoom + 0.1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreenOpen(true)}
                    className="h-8 w-8 p-0"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Drafting Canvas Stage */}
              <div className="preview-stage overflow-hidden relative">
                {/* Lanyard Top Clip (if active) */}
                {showLanyard && (
                  <div className="badge-clip-wrapper">
                    <div className="badge-lanyard-strap" />
                    <div className="badge-metal-clip" />
                  </div>
                )}

                {/* Single 3D Flip View */}
                {viewMode === "interactive" && (
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease",
                    }}
                    className="card-3d-stage cursor-pointer py-4"
                    onClick={() => setIsFlipped(!isFlipped)}
                    title="Click card to flip between Front and Back"
                  >
                    <div className={cn("card-3d-inner", isFlipped && "is-flipped")}>
                      <div className="card-face-front">
                        <IDCardFace
                          data={data}
                          role={role}
                          template={template}
                          orientation={orientation}
                          side="front"
                          photo={photo}
                          logo={logo}
                          signature={signature}
                          hodSignature={hodSignature}
                          themeColor={themeColor}
                          cardRef={cardRefFront}
                        />
                      </div>
                      <div className="card-face-back">
                        <IDCardFace
                          data={data}
                          role={role}
                          template={template}
                          orientation={orientation}
                          side="back"
                          photo={photo}
                          logo={logo}
                          signature={signature}
                          hodSignature={hodSignature}
                          themeColor={themeColor}
                          cardRef={cardRefBack}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Dual View */}
                {viewMode === "split" && (
                  <div
                    style={{
                      transform: `scale(${Math.min(zoom, 0.85)})`,
                      transformOrigin: "center center",
                    }}
                    className="flex flex-wrap items-center justify-center gap-6 py-4"
                  >
                    <div className="space-y-1.5 text-center">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Front View
                      </span>
                      <IDCardFace
                        data={data}
                        role={role}
                        template={template}
                        orientation={orientation}
                        side="front"
                        photo={photo}
                        logo={logo}
                        signature={signature}
                        hodSignature={hodSignature}
                        themeColor={themeColor}
                        cardRef={cardRefFront}
                      />
                    </div>
                    <div className="space-y-1.5 text-center">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Back View
                      </span>
                      <IDCardFace
                        data={data}
                        role={role}
                        template={template}
                        orientation={orientation}
                        side="back"
                        photo={photo}
                        logo={logo}
                        signature={signature}
                        hodSignature={hodSignature}
                        themeColor={themeColor}
                        cardRef={cardRefBack}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Button
                    type="button"
                    onClick={downloadPng}
                    className="h-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    PNG Image
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={downloadPdf}
                    className="h-10 font-bold flex items-center justify-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    CR80 PDF
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-10 font-bold flex items-center justify-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving}
                    className="h-10 font-bold flex items-center justify-center gap-2 text-primary border-primary/40 hover:bg-primary/10"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save to DB"}
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        dbStatus.connected ? "bg-emerald-500" : "bg-amber-500",
                      )}
                    />
                    {dbStatus.text}
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Saved Cards Modal */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderHeart className="h-5 w-5 text-rose-500" />
                <h3 className="font-extrabold text-base">Saved Cards Library</h3>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold">
                  {savedCards.length} Cards
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {savedCards.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <IdCardIcon className="h-10 w-10 mx-auto opacity-40" />
                  <p className="font-semibold text-sm">No saved cards yet</p>
                  <p className="text-xs">
                    Click "Save to DB" to store cards in MongoDB or Local Storage.
                  </p>
                </div>
              ) : (
                savedCards.map((c, i) => (
                  <div
                    key={c._id || c.registrationNumber || i}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {c.photo ? (
                          <img
                            src={c.photo}
                            alt={c.studentName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm truncate text-foreground">
                            {c.studentName}
                          </h4>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                            {c.role || "student"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          ID:{" "}
                          <span className="font-mono font-semibold">
                            {c.registrationNumber || c.studentId}
                          </span>{" "}
                          • {c.department}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {c.collegeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleLoadSavedCard(c)}
                        className="h-8 text-xs font-semibold"
                      >
                        Load
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedCard(c._id, c.registrationNumber)}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ID Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <h3 className="font-extrabold text-base">Campus Security ID Verification</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setVerificationResult(null);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyStudent} className="space-y-3">
              <Label htmlFor="verify-reg" className="text-xs font-semibold">
                Registration or Employee Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="verify-reg"
                  value={verifyRegNo}
                  onChange={(e) => setVerifyRegNo(e.target.value)}
                  placeholder="e.g. 22BCE10482"
                  className="font-mono text-sm"
                />
                <Button type="submit" disabled={isVerifying} className="font-bold">
                  {isVerifying ? "Verifying..." : "Verify ID"}
                </Button>
              </div>
            </form>

            {verificationResult && (
              <div
                className={cn(
                  "p-4 rounded-xl border text-sm space-y-2.5",
                  verificationResult.verified
                    ? "bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                    : "bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 text-amber-950 dark:text-amber-100",
                )}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {verificationResult.verified ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span>OFFICIALLY VERIFIED • ACTIVE CREDENTIAL</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span>NOT FOUND IN CENTRAL REGISTRY</span>
                    </>
                  )}
                </div>

                {verificationResult.verified && verificationResult.student && (
                  <div className="text-xs space-y-1 font-mono pt-1">
                    <p>
                      <strong>Name:</strong> {verificationResult.student.studentName}
                    </p>
                    <p>
                      <strong>Reg Number:</strong> {verificationResult.student.registrationNumber}
                    </p>
                    <p>
                      <strong>Department:</strong> {verificationResult.student.department}
                    </p>
                    <p>
                      <strong>Institution:</strong> {verificationResult.student.collegeName}
                    </p>
                    <p>
                      <strong>Academic Validity:</strong> {verificationResult.student.academicYear}
                    </p>
                    <p className="text-[10px] text-muted-foreground break-all pt-1">
                      Hash: {verificationResult.student.verificationToken || "SEC-TOKEN-OK"}
                    </p>
                  </div>
                )}
                {!verificationResult.verified && (
                  <p className="text-xs text-muted-foreground">
                    {verificationResult.message ||
                      "This registration number is not registered in MongoDB or memory cache."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full px-4 text-white">
              <span className="font-bold text-sm">High-Resolution Fullscreen Inspection</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8"
                >
                  <RotateCw className="h-3.5 w-3.5 mr-1" /> Flip Side
                </Button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenOpen(false)}
                  className="p-1 rounded-full text-white/80 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/10 max-w-full overflow-auto flex items-center justify-center">
              <IDCardFace
                data={data}
                role={role}
                template={template}
                orientation={orientation}
                side={isFlipped ? "back" : "front"}
                photo={photo}
                logo={logo}
                signature={signature}
                hodSignature={hodSignature}
                themeColor={themeColor}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
