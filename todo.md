# Project TODO List

Based on the [Detailed Audit Report](file:///Users/patwary/.gemini/antigravity/brain/ca468d59-b819-47da-9558-898d1775493c/PROJECT_AUDIT_REPORT_DETAILED.md).

## 🔴 High Priority

### Code & Architecture
- [x] Refactor `BiodataForm.tsx` into smaller, modular components (e.g., `Step1Basic.tsx`).
- [ ] Implement robust debounced autosave on every field change (via `form.watch`).
- [x] Optimize database queries for JSON fields in `app/biodata/page.tsx` (indexing).

### Product & Features
- [ ] Implement the `app/api/report` endpoint and front-end "Report Profile" button.
- [ ] Develop an Admin Dashboard at `/admin` to manage users and biodatas.

### UX / UI
- [ ] Audit and add ARIA labels/roles across core components for accessibility.

---

## 🟡 Medium Priority

### Product & Features
- [ ] Add a "Review & Submit" step to the biodata creation flow.
- [ ] Add "How it Works" and "Security" sections to the landing page.

### UX / UI
- [ ] Improve mobile responsiveness of the `BiodataForm` sticky header.
- [ ] Standardize button icon-spacing (`gap-2`) across the project.
- [ ] Implement skeleton loaders for `BiodataCard` in the browse page.

### Code & Architecture
- [x] Extract `CustomFieldsFormBlock` to a global reusable component.

---

## 🟢 Low Priority

### UX / UI
- [ ] Enhance "No matched results" empty state with recommendations.
- [ ] Standardize typography scales and border styles.

### Product & Features
- [ ] Implement a "Profile Strength" meter.
- [ ] Add social sharing (OG images) for public profiles.
- [ ] Add photo cropping tool before upload.
- [ ] Provide multiple PDF themes for users.
