# Gaurav Workspace

A single-screen, recruiter-ready overview for Gaurav Patil. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Firebase to deliver instant resume downloads, VibeCoding beta highlights, and an admin cockpit for content management.

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 3
- Firebase Web SDK (Auth, Firestore, Storage)
- React Hook Form + Zod for form handling

## Prerequisites
- Node.js 20+
- npm 10+
- Firebase project with Firestore, Authentication, and Storage enabled

## Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   - Duplicate `.env.local` and fill in the real admin email for `NEXT_PUBLIC_ADMIN_EMAIL`.
   - The Firebase public config is already included and safe to expose.
3. **Update Firebase security rules**
   - Replace `admin@example.com` in `firebase.rules.firestore` and `firebase.rules.storage` with the authorized admin email.
   - Deploy rules:
     ```bash
     firebase deploy --only firestore:rules,storage:rules
     ```
4. **Provision Firebase Auth**
   - Add the admin email to Firebase Authentication (Email/Password provider).
5. **Run locally**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

## Admin Console
- Navigate to `/admin` and sign in with the configured admin account.
- Dashboard tabs:
  - **Messages**: review, triage, and reply to inbound messages; status updates automatically persist.
  - **Projects**: manage published cards (including the VibeCoding beta) and upload optimized preview images.
  - **Settings**: manage the resume download URL, upload a fresh resume PDF (auto-updates Storage + Firestore), and set social links.

## Updating the Resume
1. Visit `/admin` → **Settings**.
2. Upload a PDF via **Upload PDF** or paste a direct download URL.
3. Save settings. The homepage instantly prefetches the new link for an immediate download experience.

## Deploying to Vercel
1. Set the same environment variables in Vercel (`NEXT_PUBLIC_*`).
2. Push the project to a Git repository and connect it to Vercel.
3. Optional: commit the Firebase rules to your CI/CD process and deploy before shipping.
4. Trigger a production deploy:
   ```bash
   npm run build
   npm run start
   ```
   (Vercel will run these automatically.)

## Scripts
- `npm run dev` – start the Next.js dev server
- `npm run lint` – run ESLint
- `npm run build` – create a production build
- `npm run start` – start the production server locally
- `npm run format` – format the codebase with Prettier
