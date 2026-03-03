# BiyeProfile

BiyeProfile is a Next.js App Router project for creating and sharing marriage biodata profiles with privacy controls.

## Stack

- Next.js 16 (App Router)
- Prisma + PostgreSQL
- NextAuth (Google + dev credentials in development)
- Tailwind CSS
- Zod validation

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Configure environment variables in `.env`:

```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXT_PUBLIC_CLOUDINARY_PRESET=...
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Start development server:

```bash
yarn dev
```

## Validation and Build Checks

Run before committing:

```bash
yarn lint
yarn build
```

## Security and Data Integrity

- API payloads are validated with Zod.
- Biodata update payloads are sanitized before persistence.
- Username and role updates use strict server-side schema validation.
- Privacy visibility can be toggled from dashboard edit mode.
