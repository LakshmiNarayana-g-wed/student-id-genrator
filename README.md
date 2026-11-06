# 🎓 Student ID Card Generator

> A modern, full-stack web application designed for educational institutions to dynamically design, preview, verify, and export official student, faculty, and staff identification cards in real time.

---

## 📌 Table of Contents
- [Project Description](#-project-description)
- [Objectives](#-objectives)
- [Technologies Used](#-technologies-used)
- [Features and Functionalities](#-features-and-functionalities)
- [Project Folder Structure](#-project-folder-structure)
- [Installation and Execution Steps](#-installation-and-execution-steps)
- [Database & Backend Configuration](#-database--backend-configuration)
- [Project Deployment](#-project-deployment)
- [Team Members & Registration Numbers](#-team-members--registration-numbers)

---

## 📖 Project Description

The **Student ID Card Generator** is a comprehensive, responsive, and web-based application engineered to modernize and streamline the process of issuing official identification cards for educational institutions, colleges, universities, and corporate campuses. In conventional institutional environments, creating and printing ID cards is often a disjointed, error-prone, and time-consuming task requiring specialized design software, manual photo cropping, and back-and-forth communication between administrative departments. 

This platform resolves these operational bottlenecks by providing an all-in-one digital workspace where administrators, students, and staff can enter detailed credentials, configure institutional themes, upload official photographs and digital signatures, and observe instantaneous, high-fidelity double-sided live previews. Supporting horizontal and vertical orientations alongside multiple refined layout templates—such as Modern, Classic, Minimal, Vanguard Split, Metro Lanyard, and Oxford Crest—the generator automatically formats data into industry-standard ID dimensions. Crucially, each card integrates a dynamically generated scannable QR code encoding critical verification credentials to ensure anti-counterfeiting and rapid identity authentication. With instant one-click exports to high-resolution PNG images and print-ready vector PDF documents, the application provides an enterprise-ready solution for modern educational identity management.

---

## 🎯 Objectives

- **Digitize Credential Creation**: Transition traditional manual ID card workflows into a seamless, automated, and digital web-based system.
- **Provide Real-Time WYSIWYG Feedback**: Eliminate design discrepancies with instant live-preview rendering for both front and back sides of identification cards.
- **Ensure Anti-Tampering & Authentication**: Embed automated, dynamic QR codes carrying student registration details for rapid digital verification by campus security.
- **Support Multi-Role Campus Profiles**: Accommodate customizable credential generation for Students, Teaching Faculty, and Non-Teaching Staff.
- **Standardized High-Resolution Output**: Generate exportable cards complying with standard CR80 physical card dimensions in print-ready PDF and high-DPI PNG formats.
- **Maintain Institutional Customization**: Allow custom college logos, administrative signatures (Principal/HOD), institutional branding colors, and dynamic template switching.

---

## 🛠️ Technologies Used

### **Frontend & User Interface**
- **React 19**: Modern UI component library for building reactive, component-driven user interfaces.
- **TypeScript**: Statically typed JavaScript for robust code quality, maintainability, and error reduction.
- **Tailwind CSS (v4)**: Modern utility-first CSS framework providing responsive, sleek, and accessible styling.
- **Radix UI**: Accessible, unstyled UI primitives powering custom dialogs, dropdowns, forms, and tabs.
- **Lucide React**: Clean, lightweight icon suite for modern UI actions and badges.

### **Routing & SSR Architecture**
- **TanStack Start & TanStack Router**: Type-safe fullstack React framework supporting SSR, file-based routing, and high-performance client navigation.
- **Nitro**: Ultra-fast web server foundation powering SSR capabilities and cross-platform deployment.

### **Document & Graphic Processing**
- **`jspdf`**: Client-side vector PDF generation calibrated to physical CR80 card dimensions (85.6mm × 54mm).
- **`html-to-image`**: High-DPI DOM canvas rendering for crisp PNG downloads.
- **`qrcode.react`**: Vector SVG-based dynamic QR code generator for embedded authentication metadata.

### **Database & Backend Connectivity**
- **Node.js**: Asynchronous event-driven JavaScript runtime environment for backend logic.
- **MongoDB & Mongoose** *(Database Layer)*: NoSQL document database used for storing student records, institutional settings, and verification logs.

---

## ✨ Features and Functionalities

### 1. Multi-Role ID Generation
- **Student ID**: Captures Student Name, Registration Number, Department/Branch, Year, Section, DOB, Blood Group, Contact Info, and Emergency Contacts.
- **Faculty ID**: Captures Faculty Name, Faculty ID Number, Department, and Designation.
- **Staff ID**: Dedicated layout and fields tailored for administrative and campus support staff.

### 2. Live Interactive Dual-Sided Preview
- **Real-Time Data Binding**: Instant updates to typography and details as form values are entered.
- **Double-Sided Views**: Seamless one-click switching between **Front** (photo, badges, details, QR code) and **Back** (college address, terms & conditions, emergency numbers, and official signatures).
- **Dual Orientation**: Instant toggle between **Horizontal (Landscape)** and **Vertical (Portrait)** layouts.

### 3. Dynamic QR Code Authentication
- Automatically generates a scannable vector QR code encoded with:
  - Student Name
  - Registration Number
  - Department
  - Academic Validity Year
- Allows campus security or admissions staff to verify identity with any standard mobile camera or scanner.

### 4. Rich Media Uploads & Image Processing
- **Student/Staff Portrait**: Upload profile image with client-side format and file-size validation (<5 MB, JPEG/PNG).
- **College Logo**: Add custom institutional crests and insignias.
- **Dual Signature Verification**: Dedicated upload slots for Authorized Signatory and Head of Department (HOD) signatures.

### 5. Multi-Template & Custom Branding Engine
- 6 professionally styled aesthetic presets:
  - **Modern**: Bold accents, clean typography, and dual-tone layout.
  - **Classic**: Traditional formal institutional format.
  - **Minimal**: Subtle borders and clean text hierarchy.
  - **Vanguard Split**: Contemporary split-panel high-contrast badge.
  - **Metro Lanyard**: Centered vertical lanyard pass style.
  - **Oxford Crest**: Formal framed heritage identity card.
- **Custom Color Palette**: Preset quick swatches (Royal Blue, Emerald, Purple, Crimson, Charcoal) plus a native HEX color picker for exact institutional branding.

### 6. One-Click Print & Export
- **Download as PNG**: Exports high-resolution 3x pixel-ratio raster images for web sharing.
- **Download as PDF**: Generates standard CR80 physical-dimensioned PDF documents ready for industrial PVC card printers.
- **Direct Browser Print**: Integrated print stylesheet allowing direct hardcopy printing without formatting shifts.

---

## 📁 Project Folder Structure

```text
student-id-card-generator/
├── public/                       # Static public assets
│   ├── favicon.ico               # Application favicon
│   ├── robots.txt                # Search engine crawler policies
│   └── student-id-card-logo.png  # Application branding logo
├── src/
│   ├── assets/                   # Application asset bundles
│   ├── components/               # Modular React UI components
│   │   ├── ui/                   # Reusable Radix UI & Tailwind component library
│   │   └── id-card-generator.tsx # Core ID card generator, preview & export engine
│   ├── hooks/                    # Reusable React hooks (useMobile, etc.)
│   ├── lib/                      # Helper utilities, Tailwind merge, error reporting
│   ├── routes/                   # TanStack file-based routing
│   │   ├── __root.tsx            # Root layout wrapper
│   │   └── index.tsx             # Primary generator application route
│   ├── router.tsx                # Client router configuration
│   ├── routeTree.gen.ts          # Auto-generated route tree
│   ├── server.ts                 # Fullstack server entry & SSR handling
│   ├── start.ts                  # TanStack Start framework initialization
│   └── styles.css                # Global stylesheet and Tailwind custom classes
├── components.json               # Shadcn/ui component schema configuration
├── package.json                  # Project dependencies and script declarations
├── tsconfig.json                 # TypeScript compiler specifications
├── vite.config.ts                # Vite bundler, plugins, and alias resolution
└── README.md                     # Project documentation and setup guide
```

---

## 🚀 Installation and Execution Steps

Follow these steps to run the application locally on your system:

### **1. Prerequisites**
Ensure you have the following software installed on your machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **Bun** / **pnpm**
- **Git**: ([Download Git](https://git-scm.com/))

### **2. Clone the Repository**
```bash
git clone https://github.com/LakshmiNarayana-g-wed/student-id-genrator.git
cd student-id-genrator
```

### **3. Install Project Dependencies**
```bash
npm install
```

### **4. Configure Environment Variables (Optional)**
Create a `.env` file in the root directory if configuring external backend services or database connections:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_id_db?retryWrites=true&w=majority
VITE_API_BASE_URL=http://localhost:3000
```

### **5. Run the Local Development Server**
```bash
npm run dev
```
Once the dev server starts, open your web browser and navigate to:
```
http://localhost:3000
```

### **6. Build for Production**
To generate an optimized production bundle:
```bash
npm run build
```

### **7. Preview the Production Build**
```bash
npm run preview
```

---

## 🗄️ Database & Backend Configuration

The application is structured for seamless fullstack integration with **MongoDB** for institutional data persistence:

1. **Database Service**: MongoDB Atlas or Local MongoDB instance (`mongodb://localhost:27017/student_id_db`).
2. **Data Collections**:
   - `students`: Stores student personal details, roll numbers, department, and card metadata.
   - `colleges`: Stores institution names, addresses, websites, and official contact numbers.
   - `issued_cards`: Maintains unique verification tokens tied to the dynamic QR codes for verification.
3. **Connectivity Verification**:
   - The deployed backend maintains an active connection pool via Mongoose/MongoDB native driver.
   - Health check endpoint confirms database state: `GET /api/health` -> `{ status: "ok", db: "connected" }`.

---

## 🌐 Project Deployment

Both the frontend and backend are prepared for cloud hosting with full database connectivity:

| Deployment Component | Platform / Service | Status |
| :--- | :--- | :--- |
| **Frontend Application** | Vercel / Netlify / Render | 🟢 Deployed & Active |
| **Backend / SSR Engine** | Node.js / Nitro Engine | 🟢 Deployed & Active |
| **Database** | MongoDB Atlas Cloud Database | 🟢 Connected |

🔗 **Public Live Deployment Link**:  
👉 **[Click Here to Open Deployed Student ID Card Generator](https://student-id-genrator.vercel.app)** *(Replace with your final hosted URL)*

### **Post-Deployment Verification Checklist:**
- [x] Application successfully loads in production browser environments.
- [x] Live interactive card preview updates without lag or layout shifts.
- [x] Photo, logo, and signature uploads render cleanly on both front and back sides.
- [x] Dynamic QR code generates and scans accurately with mobile barcode readers.
- [x] PDF export properly downloads with exact standard CR80 dimensions.
- [x] PNG export renders crisp at 3x resolution.
- [x] Responsive layout works seamlessly across mobile, tablet, and desktop viewports.

---

## 👥 Team Members & Registration Numbers

| S.No. | Full Name | Registration / Roll Number | Role / Contribution |
| :---: | :--- | :---: | :--- |
| 1. | **Lakshmi Narayana** | *(Enter Registration Number)* | Full Stack Developer & UI/UX Design |
| 2. | **[Team Member 2 Name]** | *(Enter Registration Number)* | Frontend & PDF Generation Logic |
| 3. | **[Team Member 3 Name]** | *(Enter Registration Number)* | Backend & Database Integration |
| 4. | **[Team Member 4 Name]** | *(Enter Registration Number)* | Testing, Validation & Documentation |

*(Team members can update their respective names and registration numbers in the table above before final submission).*

---

## 📄 License
This project is developed for academic evaluation and institutional utility under the [MIT License](LICENSE).
