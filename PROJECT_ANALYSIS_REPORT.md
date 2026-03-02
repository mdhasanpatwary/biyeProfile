# BiyeProfile - Project Analysis Report

## 1. Project Overview

**Project Name:** BiyeProfile
**Project Type:** Full-stack Web Application (Next.js)
**Core Functionality:** A Bengali marriage biodata creation and management platform that allows users to create professional matrimonial profiles, generate shareable links, and export as PDF.
**Target Users:** Bengali-speaking individuals looking for marriage partners, primarily in Bangladesh and the Bengali diaspora.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS v4 with PostCSS
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner (toast notifications)
- **Fonts:** Geist (Sans + Mono)

### Backend
- **Runtime:** Next.js API Routes (Route Handlers)
- **Database:** PostgreSQL
- **ORM:** Prisma 7.4.2 with pg adapter
- **Authentication:** NextAuth.js v5 (Beta)
- **Image Storage:** Cloudinary

### Development Tools
- **Language:** TypeScript
- **Linting:** ESLint
- **Package Manager:** Yarn / npm

---

## 3. Project Structure

```
biyeProfile/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/  # NextAuth handlers
│   │   ├── biodata/             # Biodata CRUD operations
│   │   ├── username/            # Username management
│   │   │   ├── check/           # Username availability check
│   │   │   └── set/             # Username setting
│   │   └── report/              # Report endpoint (empty)
│   ├── biodata/[username]/      # Public biodata view
│   │   └── page.tsx             # Public profile page
│   ├── dashboard/               # Protected dashboard
│   │   ├── edit/                # Biodata editor
│   │   │   └── page.tsx         # Edit biodata
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── layout.config.ts     # Dashboard config
│   │   └── page.tsx             # Dashboard home
│   ├── setup/                   # Initial username setup
│   │   └── page.tsx             # Setup form
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                  # React Components
│   ├── BiodataContent.tsx       # Public biodata display
│   ├── BiodataEditor.tsx        # Split edit/preview view
│   ├── BiodataForm.tsx          # Multi-step form (8 steps)
│   ├── BiodataPreview.tsx        # Live preview component
│   ├── CreateBiodataButton.tsx  # Create new biodata
│   ├── DevLoginButton.tsx       # Dev mode login
│   ├── DownloadPDFButton.tsx     # PDF export
│   ├── PhotoUpload.tsx          # Cloudinary image upload
│   └── SetupForm.tsx            # Username setup form
├── lib/                         # Utility libraries
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client instance
│   └── validations/             # Zod schemas
│       ├── biodata.ts           # Biodata form validation
│       └── username.ts          # Username validation
├── prisma/
│   └── schema.prisma            # Database schema
├── types/
│   └── next-auth.d.ts           # TypeScript types
└── Configuration files
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── eslint.config.mjs
    └── package.json
```

---

## 4. Database Schema

### User Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Auto-generated unique ID |
| name | String? | Optional | User's display name |
| email | String | Unique, Required | User's email (used for login) |
| image | String? | Optional | Profile picture URL |
| username | String? | Unique | Public profile URL slug |
| role | String | Default: "user" | User role (for future admin) |
| createdAt | DateTime | Auto | Creation timestamp |
| biodata | Relation | One-to-One | Associated biodata |

### Biodata Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Auto-generated unique ID |
| userId | String | Unique, Required | Foreign key to User |
| language | String | Default: "bn" | UI language (en/bn) |
| isPublic | Boolean | Default: true | Profile visibility toggle |
| isReported | Boolean | Default: false | Report flag |
| data | JSON | Required | Complete biodata object |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers |

### Biodata
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/biodata` | Create new biodata |
| PUT | `/api/biodata` | Update existing biodata (autosave) |

### Username
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/username/check?username=x` | Check username availability |
| POST | `/api/username/set` | Set username for user |

---

## 6. Pages & Routes

### Public Routes
| Path | Page | Description |
|------|------|-------------|
| `/` | Landing Page | Hero, features, login/signup |
| `/biodata/[username]` | Public Profile | View public biodata |

### Protected Routes (Require Auth + Username)
| Path | Page | Description |
|------|------|-------------|
| `/dashboard` | Dashboard Home | Create new biodata |
| `/dashboard/edit` | Edit Biodata | Full editor with preview |

### Setup Routes
| Path | Page | Description |
|------|------|-------------|
| `/setup` | Username Setup | Set public profile URL |

---

## 7. Key Features

### Authentication
- Google OAuth provider
- Credentials provider (development only)
- JWT session strategy
- Auto user creation on first sign-in
- Protected routes with middleware

### Biodata Form (8-Step Wizard)
1. **Basic Info** - Name, DOB, age (auto-calculated), height, weight, blood group, religion, marital status, nationality, photo
2. **Personal Info** - Present/permanent address, district, division, native village, complexion, physical status, hobbies
3. **Education** - Multiple qualifications (degree, institution, year, result)
4. **Profession** - Occupation, organization, employment type, income, workplace
5. **Family Info** - Parents' names & professions, siblings count, family status
6. **Expectations** - Preferred partner criteria
7. **Contact Info** - Phone, WhatsApp, email, guardian contact
8. **Custom** - User-defined custom sections

### Public Profile
- Clean, professional A4-optimized layout
- Print-friendly design
- PDF download functionality
- Language toggle (English/Bengali)
- Privacy toggle (public/private)

### Autosave
- 2-second debounced auto-save to database
- Toast notifications on save

### Image Upload
- Cloudinary integration
- 1MB max file size
- JPEG/PNG supported

---

## 8. Form Validation (Zod)

### Biodata Validation Rules
- **Full Name:** 2-100 characters
- **Date of Birth:** Required
- **Height:** Required
- **Blood Group:** Required
- **Religion:** Required
- **Marital Status:** Required
- **Present Address:** 5-500 characters
- **Permanent Address:** 5-500 characters
- **District:** 2-50 characters
- **Education:** At least 1 qualification required
- **Occupation:** 2-200 characters
- **Father's Name:** 2-100 characters
- **Mother's Name:** 2-100 characters
- **Contact Number:** 10-20 digits

### Username Validation Rules
- 3-30 characters
- Alphanumeric + hyphens only
- Must start with letter
- Reserved words blocked (admin, dashboard, api, etc.)

---

## 9. Component Architecture

### Core Components

#### BiodataForm
- **Type:** Client Component ("use client")
- **State:** React Hook Form with Zod resolver
- **Features:**
  - Multi-step wizard (8 steps)
  - Auto-scrolling tabs
  - Debounced autosave (2s)
  - Age calculation from DOB
  - Dynamic field arrays for education
  - Language toggle (en/bn)

#### BiodataEditor
- **Type:** Client Component
- **Features:**
  - Split view: Form + Live Preview
  - Mobile toggle between edit/preview
  - Print button
  - Link to live profile

#### BiodataContent
- **Type:** Server/Client Component
- **Features:**
  - Renders biodata data
  - Print-optimized CSS
  - Bilingual labels (en/bn)
  - Conditional section rendering

#### PhotoUpload
- **Type:** Client Component
- **Features:**
  - Cloudinary Upload Widget
  - Image preview
  - File type/size validation
  - Change/Remove functionality

---

## 10. User Flows

### New User Flow
```
1. Land on homepage (/)
2. Click "Sign In" → Google Auth
3. Redirected to /setup (if no username)
4. Set username → Redirect to /dashboard
5. Click "Create Biodata" → API creates entry
6. Redirect to /dashboard/edit
7. Fill 8-step form (autosaves)
8. Visit /biodata/[username] to view public profile
```

### Returning User Flow
```
1. Sign in at homepage
2. Redirect to /dashboard (if has username + biodata)
3. Or redirect to /dashboard/edit (if has biodata)
4. Or redirect to /setup (if no username)
```

### Public Profile View
```
1. Visit /biodata/[username]
2. View complete biodata (if public)
3. Toggle to private if owner
4. Download as PDF
5. Print directly
```

---

## 11. Security Features

- Route protection via NextAuth
- Username uniqueness enforcement
- Reserved username blocking
- File type/size restrictions on upload
- SQL injection prevention via Prisma
- Input validation via Zod
- JWT-based sessions

---

## 12. Environment Variables Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth secret key |
| `NEXTAUTH_URL` | NextAuth base URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_CLOUDINARY_PRESET` | Cloudinary upload preset |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |

---

## 13. Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 14. Dependencies Summary

### Production Dependencies
- `@prisma/client` - Database ORM
- `@prisma/adapter-pg` - PostgreSQL adapter
- `next` - React framework
- `next-auth` - Authentication
- `next-cloudinary` - Image uploads
- `pg` - PostgreSQL driver
- `react` / `react-dom` - UI library
- `react-hook-form` - Form handling
- `sonner` - Toast notifications
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration

### Development Dependencies
- `prisma` - Database tooling
- `typescript` - Type safety
- `tailwindcss` - Styling
- `eslint` - Code linting

---

## 15. Current Project State

### Completed Features
- ✅ User authentication (Google + Dev)
- ✅ Username setup and management
- ✅ 8-step biodata form with validation
- ✅ Autosave functionality
- ✅ Public profile page
- ✅ PDF download capability
- ✅ Photo upload via Cloudinary
- ✅ Print-friendly styling
- ✅ Bilingual support (English/Bengali)
- ✅ Profile privacy toggle

### Potential Improvements
- Admin dashboard for user management
- Report functionality for profiles
- Email notifications
- Multiple profile templates
- Social sharing integration
- SEO optimization
- Analytics dashboard
- Mobile app companion

---

## 16. File Statistics

| Category | Count | Notable Files |
|----------|-------|---------------|
| API Routes | 4 | biodata, username, auth |
| Pages | 7 | Home, dashboard, setup, etc. |
| Components | 9 | Form, editor, content, etc. |
| Validations | 2 | biodata, username schemas |
| Config Files | 7 | Next.js, TS, ESLint, Prisma |
| Styles | 1 | globals.css |

---

*Report generated from project analysis*
