import { useRef, useState, type ChangeEvent } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CardSide = "front" | "back";
type Template = "modern" | "classic" | "minimal" | "vanguard" | "metro" | "oxford";
type CardRole = "student" | "staff" | "faculty";
type CardOrientation = "horizontal" | "vertical";

type FormData = {
  studentName: string;
  studentId: string;
  registrationNumber: string;
  department: string;
  year: string;
  section: string;
  dateOfBirth: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  academicYear: string;
  emergencyContact: string;
  collegeName: string;
  collegeAddress: string;
  collegeWebsite: string;
  collegeContact: string;
};

const initialData: FormData = {
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

const studentFields: Array<{
  key: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}> = [
  { key: "studentName", label: "Student name", placeholder: "Enter your name", required: true },
  { key: "registrationNumber", label: "Registration number", placeholder: "Enter your registration number", required: true },
  { key: "department", label: "Department / Branch", placeholder: "Enter your department / branch", required: true },
  { key: "year", label: "Year", placeholder: "Enter your year", required: true },
  { key: "section", label: "Section", placeholder: "Enter your section" },
  { key: "dateOfBirth", label: "Date of birth", placeholder: "", type: "date" },
  { key: "bloodGroup", label: "Blood group", placeholder: "Enter your blood group" },
  { key: "phone", label: "Phone number", placeholder: "Enter your phone number", type: "tel" },
  { key: "email", label: "Email", placeholder: "Enter your email address", type: "email" },
  { key: "academicYear", label: "Academic year", placeholder: "Enter the academic year", required: true },
  { key: "emergencyContact", label: "Emergency contact", placeholder: "Enter an emergency contact number", type: "tel" },
];

const collegeFields: Array<{
  key: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}> = [
  { key: "collegeName", label: "College name", placeholder: "Enter your college name", required: true },
  { key: "collegeWebsite", label: "Website", placeholder: "Enter your college website" },
  { key: "collegeContact", label: "Contact number", placeholder: "Enter your college contact number", type: "tel" },
];

const templates: Array<{ id: Template; name: string; detail: string }> = [
  { id: "modern", name: "Modern", detail: "Bold & clean" },
  { id: "classic", name: "Classic", detail: "Formal & timeless" },
  { id: "minimal", name: "Minimal", detail: "Simple & refined" },
  { id: "vanguard", name: "Vanguard Split", detail: "Bold split panel" },
  { id: "metro", name: "Metro Lanyard", detail: "Centered vertical pass" },
  { id: "oxford", name: "Oxford Crest", detail: "Formal framed ID" },
];

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: (typeof studentFields)[number];
  value: string;
  error: string | undefined;
  onChange: (key: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.key}>
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={field.key}
        type={field.type ?? "text"}
        value={value}
        maxLength={field.type === "email" ? 120 : 80}
        placeholder={field.placeholder}
        aria-invalid={Boolean(error)}
        className={cn("h-10 bg-surface", error && "border-destructive")}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Logo({ src }: { src: string | null }) {
  return src ? (
    <img src={src} alt="College logo" className="h-full w-full object-contain" />
  ) : (
    <GraduationCap className="h-8 w-8" aria-hidden="true" />
  );
}

function Avatar({ src }: { src: string | null }) {
  return src ? (
    <img src={src} alt="Student portrait" className="h-full w-full object-cover" />
  ) : (
    <UserRound className="h-20 w-20" aria-hidden="true" />
  );
}

function IDCard({
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
}: {
  data: FormData;
  role: CardRole;
  template: Template;
  orientation: CardOrientation;
  side: CardSide;
  photo: string | null;
  logo: string | null;
  signature: string | null;
  hodSignature: string | null;
  themeColor: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const roleName = role === "student" ? "Student" : role === "staff" ? "Staff" : "Faculty";
  const qrValue = JSON.stringify({
    name: data.studentName,
    id: role === "student" ? data.registrationNumber : data.studentId,
    registration: data.registrationNumber,
    department: data.department,
    academicYear: data.academicYear,
  });

  return (
    <div ref={cardRef} style={{ "--card-accent": themeColor } as React.CSSProperties} className={cn("id-card", "id-card--themed", `id-card--${template}`, `id-card--${orientation}`)}>
      {side === "front" ? template === "oxford" ? (
        <div className="id-card__face id-card__oxford">
          <header className="id-card__oxford-header">
            <h2>{data.collegeName || "College name"}</h2>
            <p>{data.collegeWebsite || "Established for Academic Excellence"}</p>
            <strong>OFFICIAL IDENTITY CERTIFICATE</strong>
          </header>
          <div className="id-card__oxford-photo"><Avatar src={photo} /></div>
          <div className="id-card__oxford-name">
            <h3>{data.studentName || `${roleName} name`}</h3>
            <p>{role === "student" ? `${data.year || "Class"} — Batch ${data.section || "A"}` : data.department || "Department"}</p>
          </div>
          <div className="id-card__oxford-details">
            <div><span>{role === "student" ? "Registration Number:" : `${roleName} ID:`}</span><strong>{role === "student" ? data.registrationNumber || "Registration number" : data.studentId || "ID number"}</strong></div>
            <div><span>{role === "student" ? "Blood Group:" : "Department:"}</span><strong>{role === "student" ? data.bloodGroup || "—" : data.department || "—"}</strong></div>
            <div><span>Emergency:</span><strong>{data.emergencyContact || data.phone || "—"}</strong></div>
          </div>
          <footer className="id-card__oxford-footer">
            <div><strong>Authorized Signatory</strong><span>{data.academicYear || "Academic year"}</span></div>
            <QRCodeSVG value={qrValue} size={54} level="M" bgColor="white" fgColor="#17233c" />
          </footer>
        </div>
      ) : template === "metro" ? (
        <div className="id-card__face id-card__metro">
          <div className="id-card__metro-slot" />
          <header className="id-card__metro-header">
            <h2>{data.collegeName || "College name"}</h2>
            <p>{roleName.toUpperCase()} PASS {data.academicYear || "2026–27"}</p>
          </header>
          <div className="id-card__metro-photo"><Avatar src={photo} /></div>
          <div className="id-card__metro-name">
            <h3>{data.studentName || `${roleName} name`}</h3>
            <p>{role === "student" ? `${data.year || "Class"} — Batch ${data.section || "A"}` : data.department || "Department"}</p>
          </div>
          <div className="id-card__metro-details">
            <div><span>{role === "student" ? "REGISTRATION NO" : `${roleName.toUpperCase()} ID`}</span><strong>{role === "student" ? data.registrationNumber || "Registration number" : data.studentId || "ID number"}</strong></div>
            <div><span>{role === "student" ? "BLOOD" : "DEPARTMENT"}</span><strong>{role === "student" ? data.bloodGroup || "—" : data.department || "—"}</strong></div>
            <div><span>{role === "student" ? "VALID" : "PHONE"}</span><strong>{role === "student" ? data.academicYear || "—" : data.phone || "—"}</strong></div>
          </div>
          <footer className="id-card__metro-footer">
            <div><span>EMERGENCY CONTACT</span><strong>{data.emergencyContact || data.phone || "—"}</strong></div>
            <QRCodeSVG value={qrValue} size={54} level="M" bgColor="white" fgColor="#10182d" />
          </footer>
        </div>
      ) : template === "vanguard" ? (
        <div className="id-card__face id-card__vanguard">
          <header className="id-card__vanguard-header">
            <div><h2>{data.collegeName || "College name"}</h2><p>{data.collegeWebsite || "Campus"}</p></div>
          </header>
          <div className="id-card__vanguard-rail">{data.collegeWebsite || "CAMPUS ID"}</div>
          <div className="id-card__vanguard-name">
            <h3>{data.studentName || `${roleName} name`}</h3>
            <p>{role === "student" ? `${data.year || "CLASS"} — BATCH ${data.section || "A"}` : data.department || "DEPARTMENT"}</p>
          </div>
          <div className="id-card__vanguard-split">
            <div className="id-card__vanguard-details">
              <div><span>{role === "student" ? "REGISTRATION NO." : `${roleName.toUpperCase()} ID`}</span><strong>{role === "student" ? data.registrationNumber || "Registration number" : data.studentId || "ID number"}</strong></div>
              <div><span>{role === "student" ? "BLOOD GRP" : "DEPARTMENT"}</span><strong>{role === "student" ? data.bloodGroup || "—" : data.department || "—"}</strong></div>
              <div><span>{role === "student" ? "VALID" : "PHONE"}</span><strong>{role === "student" ? data.academicYear || "—" : data.phone || "—"}</strong></div>
              <QRCodeSVG value={qrValue} size={62} level="M" bgColor="white" fgColor="#10182d" />
            </div>
            <div className="id-card__vanguard-panel"><span>{(data.studentName || roleName).trim().charAt(0).toUpperCase()}</span></div>
          </div>
        </div>
      ) : (
        <div className="id-card__face">
          <header className="id-card__header">
            <div className="id-card__logo"><Logo src={logo} /></div>
            <div className="min-w-0 flex-1">
              <p className="id-card__college">{data.collegeName || "College name"}</p>
              <p className="id-card__website">{data.collegeWebsite || "www.college.edu"}</p>
            </div>
          </header>
          <div className="id-card__title">{roleName.toUpperCase()} ID CARD</div>
          <div className="id-card__content">
            <div className="id-card__portrait"><Avatar src={photo} /></div>
            <div className="id-card__identity">
              <h2>{data.studentName || `${roleName} name`}</h2>
              <p className="id-card__id">{role === "student" ? data.registrationNumber || "Registration number" : data.studentId || `${roleName.toUpperCase()} ID`}</p>
              <dl>
                <div><dt>Branch</dt><dd>{data.department || "—"}</dd></div>
                <div><dt>Year / Sec</dt><dd>{data.year || "—"} {data.section && `• ${data.section}`}</dd></div>
                <div><dt>Blood</dt><dd>{data.bloodGroup || "—"}</dd></div>
                <div><dt>Valid</dt><dd>{data.academicYear || "—"}</dd></div>
              </dl>
            </div>
            <div className="id-card__qr">
              <QRCodeSVG value={qrValue} size={72} level="M" bgColor="transparent" fgColor="currentColor" />
              <span>SCAN TO VERIFY</span>
            </div>
          </div>
          <footer className="id-card__footer">
            <span><Phone /> {data.phone || "—"}</span>
            <span><Mail /> {data.email || "—"}</span>
          </footer>
        </div>
      ) : (
        <div className="id-card__face id-card__back">
          <header className="id-card__back-header">
            <div className="id-card__logo"><Logo src={logo} /></div>
            <div><p>{data.collegeName || "College name"}</p><span>{roleName.toUpperCase()} IDENTIFICATION</span></div>
          </header>
          <div className="id-card__back-body">
            <div className="id-card__address">
              <MapPin />
              <div><strong>{role === "student" ? "College address" : "Address"}</strong><p>{role === "student" ? data.collegeAddress || "College address" : data.address || "Address"}</p></div>
            </div>
            {role !== "student" && <div className="id-card__address"><MapPin /><div><strong>College address</strong><p>{data.collegeAddress || "College address"}</p></div></div>}
            <div className="id-card__emergency">
              <ShieldCheck />
              <div><span>IN CASE OF EMERGENCY</span><strong>{data.emergencyContact || "—"}</strong></div>
            </div>
            <div className="id-card__instructions">
              <strong>Important instructions</strong>
              <ol>
                <li>This card is the property of the issuing institution.</li>
                <li>It must be carried on campus and presented on request.</li>
                <li>If found, please return it to the college office.</li>
              </ol>
            </div>
            <div className="id-card__signature">
              <div>
                {signature ? <img src={signature} alt="Authorized signature" /> : <span className="id-card__signature-mark">M. Rao</span>}
                <p>Authorized signature</p>
              </div>
              <div>{hodSignature ? <img src={hodSignature} alt="Head of Department signature" /> : <span className="id-card__signature-mark">HOD</span>}<p>HOD signature</p></div>
              <div className="id-card__contact"><Phone /> {data.collegeContact || "—"}<br />{data.collegeWebsite}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function IDCardGenerator() {
  const [data, setData] = useState(initialData);
  const [role, setRole] = useState<CardRole>("student");
  const [aboutPage, setAboutPage] = useState(false);
  const [template, setTemplate] = useState<Template>("modern");
  const [themeColor, setThemeColor] = useState("#1d4ed8");
  const [orientation, setOrientation] = useState<CardOrientation>("horizontal");
  const [side, setSide] = useState<CardSide>("front");
  const [photo, setPhoto] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [hodSignature, setHodSignature] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [notice, setNotice] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const roleFields = role === "student" ? studentFields : [
    { key: "studentName" as const, label: `${role === "staff" ? "Staff" : "Faculty"} name`, placeholder: `Enter your ${role} name`, required: true },
    { key: "studentId" as const, label: `${role === "staff" ? "Staff" : "Faculty"} ID`, placeholder: `Enter your ${role} ID`, required: true },
    { key: "department" as const, label: "Department", placeholder: "Enter your department", required: true },
    { key: "phone" as const, label: "Phone", placeholder: "Enter your phone number", type: "tel" },
  ];

  const updateField = (key: keyof FormData, value: string) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleUpload = (
    setter: (value: string | null) => void,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(["image/jpeg", "image/png"].includes(file.type)) || file.size > 5 * 1024 * 1024) {
      setNotice("Please choose a JPG or PNG image under 5 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    setNotice("");
  };

  const validate = () => {
    const next: Partial<Record<keyof FormData, string>> = {};
    [...roleFields, ...(role === "student" ? collegeFields : [])].forEach((field) => {
      if (field.required && !data[field.key].trim()) next[field.key] = `${field.label} is required.`;
    });
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) setNotice("Complete the highlighted fields before downloading.");
    return Object.keys(next).length === 0;
  };

  const renderPng = async () => {
    if (!cardRef.current || !validate()) return null;
    setNotice("Preparing your card…");
    try {
      return await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    } catch {
      setNotice("The card could not be prepared. Please try again.");
      return null;
    }
  };

  const downloadPng = async () => {
    const image = await renderPng();
    if (!image) return;
    const link = document.createElement("a");
    link.download = `${(role === "student" ? data.registrationNumber : data.studentId) || role}-${side}-id-card.png`;
    link.href = image;
    link.click();
    setNotice("PNG downloaded successfully.");
  };

  const downloadPdf = async () => {
    const image = await renderPng();
    if (!image) return;
    const width = orientation === "horizontal" ? 85.6 : 54;
    const height = orientation === "horizontal" ? 54 : 85.6;
    const pdf = new jsPDF({ orientation: orientation === "horizontal" ? "landscape" : "portrait", unit: "mm", format: [width, height] });
    pdf.addImage(image, "PNG", 0, 0, width, height);
    pdf.save(`${(role === "student" ? data.registrationNumber : data.studentId) || role}-${side}-id-card.pdf`);
    setNotice("PDF downloaded successfully.");
  };

  const reset = () => {
    if (!window.confirm("Reset all student and college details?")) return;
    setData(initialData);
    setPhoto(null);
    setLogo(null);
    setSignature(null);
    setHodSignature(null);
    setTemplate("modern");
    setThemeColor("#1d4ed8");
    setOrientation("horizontal");
    setSide("front");
    setErrors({});
    setNotice("Form cleared.");
  };

  return (
    <main className="app-shell relative min-h-screen overflow-x-hidden">
      <header className="relative z-50 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white"><img src="/student-id-card-logo.png" alt="Student ID card logo" className="h-full w-full object-contain" /></div>
            <div><h1 className="text-lg font-bold text-foreground sm:text-xl">Student ID Card Generator</h1><p className="text-xs text-muted-foreground">Create campus-ready digital identification</p></div>
          </div>
          <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-1 border-t border-border pt-3 text-sm sm:order-none sm:w-auto sm:border-0 sm:pt-0">
            <details className="group relative">
              <summary onClick={() => setSide("front")} className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 font-medium hover:bg-muted">Tools <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary>
              <div className="absolute left-0 top-full z-20 mt-1 min-w-44 rounded-md border border-border bg-surface p-1 shadow-lg">
                {[{ label: "Student ID", role: "student" as const }, { label: "Staff ID", role: "staff" as const }, { label: "Faculty ID", role: "faculty" as const }].map((item) => <button key={item.role} type="button" className="block w-full rounded px-3 py-2 text-left hover:bg-muted" onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); setAboutPage(false); setRole(item.role); setSide("front"); setNotice(`${item.label} selected.`); }}>{item.label}</button>)}
              </div>
            </details>
            <button type="button" onClick={() => { setAboutPage(false); window.setTimeout(() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" }), 0); }} className="rounded-md px-3 py-2 font-medium hover:bg-muted">Templates</button>
            <button type="button" onClick={() => setAboutPage(true)} className="rounded-md px-3 py-2 font-medium hover:bg-muted">About</button>
          </nav>
          <div className="hidden items-center gap-2 text-sm font-medium text-success sm:flex"><CheckCircle2 className="h-4 w-4" /> Live preview active</div>
        </div>
      </header>

      {aboutPage ? <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-surface p-8 shadow-panel sm:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">About</p>
          <h2 className="mt-3 text-3xl font-bold">Student ID Card Generator</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Create and preview student, staff, and faculty identification cards. Add personal and college details, choose a card template, and download or print the finished card.</p>
          <div className="mt-8 rounded-lg bg-muted/50 p-5">
            <h3 className="font-semibold">Contact</h3>
            <p className="mt-1 text-sm text-muted-foreground">For questions or assistance, call:</p>
            <a className="mt-2 inline-block text-lg font-semibold text-primary hover:underline" href="tel:9346193628">9346193628</a>
          </div>
          <Button type="button" className="mt-8" onClick={() => setAboutPage(false)}>Back to card generator</Button>
        </div>
      </section> : <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,.92fr)] lg:px-8">
        <section className={cn("role-panel min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-panel", role === "student" && "role-panel--student")}>
          <div className="flex items-center gap-2 border-b border-border px-5 py-4"><UserRound className="h-5 w-5 text-primary" /><div><h2 className="font-bold">{role === "student" ? "Student details" : `${role === "staff" ? "Staff" : "Faculty"} details`}</h2><p className="text-xs text-muted-foreground">Fields marked * are required</p></div></div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {roleFields.map((field) => <Field key={field.key} field={field} value={data[field.key]} error={errors[field.key]} onChange={updateField} />)}
            {role === "student" ? <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="address">Residential address</Label><Textarea id="address" maxLength={240} value={data.address} placeholder="Enter your residential address" className="bg-surface" onChange={(event) => updateField("address", event.target.value)} /></div> : <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" maxLength={240} value={data.address} placeholder="Enter your address" className="bg-surface" onChange={(event) => updateField("address", event.target.value)} /></div>}
          </div>

          <div className="border-t border-border">
            <div className="flex items-center gap-2 px-5 py-4"><Building2 className="h-5 w-5 text-primary" /><h2 className="font-bold">College details</h2></div>
            <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
              {(role === "student" ? collegeFields : [collegeFields[0]]).map((field) => <Field key={field.key} field={field} value={data[field.key]} error={errors[field.key]} onChange={updateField} />)}
              <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="collegeAddress">College address</Label><Textarea id="collegeAddress" maxLength={240} value={data.collegeAddress} placeholder="Enter your college address" className="bg-surface" onChange={(event) => updateField("collegeAddress", event.target.value)} /></div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border p-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Student photo", id: "photo", setter: setPhoto },
              { label: "College logo", id: "logo", setter: setLogo },
              { label: "Signature", id: "signature", setter: setSignature },
              { label: "HOD signature", id: "hod-signature", setter: setHodSignature },
            ].map((upload) => (
              <div key={upload.id}>
                <Label htmlFor={upload.id} className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/50 px-3 text-center hover:border-primary hover:bg-accent">
                  <ImagePlus className="h-5 w-5 text-primary" /><span>{upload.label}</span><small className="font-normal text-muted-foreground">JPG or PNG, up to 5 MB</small>
                </Label>
                <input id={upload.id} type="file" accept="image/jpeg,image/png" className="sr-only" onChange={(event) => handleUpload(upload.setter, event)} />
              </div>
            ))}
          </div>
        </section>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-lg border border-border bg-surface shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Live preview</p><h2 className="font-bold">Digital {role === "student" ? "student" : role} card</h2></div>
              <div className="flex flex-wrap gap-2">
                <div className="flex rounded-md bg-muted p-1" aria-label="Card orientation">
                  {(["horizontal", "vertical"] as CardOrientation[]).map((item) => <Button key={item} type="button" size="sm" variant={orientation === item ? "default" : "ghost"} onClick={() => setOrientation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</Button>)}
                </div>
                <div className="flex rounded-md bg-muted p-1" aria-label="Card side">
                  {(["front", "back"] as CardSide[]).map((item) => <Button key={item} type="button" size="sm" variant={side === item ? "default" : "ghost"} onClick={() => setSide(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</Button>)}
                </div>
              </div>
            </div>

            <div className="preview-stage"><IDCard data={data} role={role} template={template} orientation={orientation} side={side} photo={photo} logo={logo} signature={signature} hodSignature={hodSignature} themeColor={themeColor} cardRef={cardRef} /></div>

            <div className="border-t border-border px-5 py-4">
              <p className="mb-3 text-sm font-semibold">Theme color</p>
              <div className="flex flex-wrap items-center gap-3">
                {[{ name: "Royal blue", value: "#1d4ed8" }, { name: "Emerald", value: "#0f766e" }, { name: "Purple", value: "#6d28d9" }, { name: "Crimson", value: "#be123c" }, { name: "Charcoal", value: "#334155" }].map((color) => (
                  <button key={color.value} type="button" aria-label={`${color.name} theme`} aria-pressed={themeColor === color.value} title={color.name} onClick={() => setThemeColor(color.value)} className={cn("h-8 w-8 rounded-full border-2 border-white shadow ring-1 ring-border", themeColor === color.value && "ring-2 ring-offset-2 ring-primary")} style={{ backgroundColor: color.value }} />
                ))}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">
                  <input type="color" value={themeColor} aria-label="Choose custom theme color" onChange={(event) => setThemeColor(event.target.value)} className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0" />
                  Custom
                </label>
              </div>
            </div>

            <div id="templates" className="border-t border-border px-5 py-4">
              <p className="mb-3 text-sm font-semibold">Choose a template</p>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((item) => (
                    <Button key={item.id} type="button" variant="outline" className={cn("template-option", template === item.id && "template-option--active")} onClick={() => { setTemplate(item.id); if (item.id === "metro" || item.id === "oxford") setOrientation("vertical"); }} aria-pressed={template === item.id}>
                    <span className={cn("template-swatch", `template-swatch--${item.id}`)} /><strong>{item.name}</strong><small>{item.detail}</small>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border p-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Button type="button" onClick={downloadPng}><Download /> PNG</Button>
              <Button type="button" variant="secondary" onClick={downloadPdf}><FileDown /> PDF</Button>
              <Button type="button" variant="outline" onClick={() => window.print()}><Printer /> Print</Button>
              <Button type="button" variant="ghost" onClick={reset}><RefreshCcw /> Reset</Button>
            </div>
            {notice && <p role="status" className="border-t border-border px-5 py-3 text-sm text-muted-foreground">{notice}</p>}
          </section>
        </aside>
      </div>}
    </main>
  );
}
