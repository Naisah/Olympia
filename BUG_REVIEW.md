# Frontend and backend review — 8 October 2026

Reviewed the React frontend, Laravel API, schema, and face-verification integration. The fixes below are saved locally. This is a code and automated-test review, not a production security certification.

## Fixed

- **Admin authorization:** resident Sanctum tokens could access admin data and write endpoints. Account-type middleware now separates administrator and resident routes, including profile endpoints.
- **Registration:** removed the mock success response. Registration validates inputs, confirms the password, verifies uploaded images on the server, and creates the user, resident, and token in a database transaction. It ignores client-provided face encodings. Failed writes remove the uploaded ID.
- **Sensitive data:** new ID uploads use private storage. User JSON hides face encodings and ID paths. Public schedules return only reservation dates and statuses, without resident IDs, purposes, or tracking numbers. Previously uploaded public IDs are not relocated by this change.
- **Identity checks:** restored duplicate-face checking and handled unavailable verification services. Removed the Python service's hardcoded simulated name check. Face matches leave the account pending ID review; they do not establish that names or ID documents are authentic. Multiple faces are rejected for ID and claimant images; saved claimant encodings are checked for length and finite values.
- **Validation:** server-side checks now cover resident names, contact details, known services and document types, real calendar dates, past appointments, future birth dates, supported statuses, field lengths, image uploads, and content links. Inputs are checked before creating guest records. Content creation no longer accepts arbitrary database columns.
- **Guest records:** an unauthenticated email no longer links a submission to, or changes demographic information on, an existing resident record. Each guest request creates a separate submission record; this can produce multiple resident entries for repeat visitors.
- **Court reservations:** pending and processing bookings occupy slots. Writes lock the service row, reject occupied/community slots, and prevent a rejected booking from reclaiming an occupied slot through an admin status change. The UI updates its schedule after submitting.
- **Frontend integration:** resident authentication, registration, and face verification use VITE_API_URL. Authentication requests no longer recreate their HTTP client on every render. Forms show server validation messages and constrain date selection.
- **Frontend behavior:** fixed month-end calendar navigation, unavailable court time selection, gallery scroll cleanup, missing hook dependencies, and unused React code. Pending document requests can now proceed through the admin workflow.
- **Abuse controls:** added rate limits to login, registration, verification, contact, and public submission routes.
- **Admin setup:** removed the hardcoded initial administrator password. New admin seeding requires ADMIN_SEED_PASSWORD with at least 12 characters; rerunning the admin seeder does not reset an existing account.

## Verification

- Laravel: **13 tests passed, 54 assertions**, using an isolated in-memory SQLite database. Regression coverage includes authorization boundaries, registration persistence, biometric privacy, duplicate-face rejection, invalid submissions, supported service date formats, schedule privacy, booking conflicts, content field allowlists, and admin seeding.
- React application lint: **passed** for App.jsx, main.jsx, components, hooks, pages, and utilities.
- Frontend production build: **passed**. Existing warnings remain for the approximately 1.8 MB JavaScript bundle and face-api.js's browser-externalized filesystem import.
- PHP application syntax checks and Python compilation: **passed**.
- Full-project lint: **24 errors remain** in legacy standalone files: refactor.js (17), corrupted replace-emojis.js (1), src/assets/script.js (5), and src/assets/tailwind-config.js (1). These are outside the current React application import graph. Their rules were not disabled to make the check appear green.

## Setup and unresolved limits

1. Apply the added migration, `2026_10_08_000000_add_barangay_certificate_document_type.php`, through your normal database migration process. It adds the document type requested by the existing certificate form. Existing service and document catalog seed data must be present. No migration was run against your existing database.
2. Configure VITE_API_URL and Laravel FRONTEND_URL for the actual deployment. New administrator setup uses ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD. Existing administrator passwords were not changed; rotate any account created with the former hardcoded default before deployment.
3. Real camera/liveness behavior, the running Python face-recognition service, MySQL locking under concurrent requests, SMTP delivery, and browser end-to-end flows were not exercised. Face-verification HTTP calls and outgoing mail were faked in backend tests.
4. OCR/name verification and an administrator ID-review interface are still missing. The browser's smile/virtual-camera checks are client-side and can be bypassed. The Python service has unauthenticated endpoints and permissive CORS; keep it private to the backend. Simultaneous biometric registrations have not been tested for races. Do not treat this as completed identity-proofing.
5. Any ID images already stored publicly need a separate data migration and access review. This change protects new uploads only.
6. The contact endpoint still uses its existing hardcoded recipient. Confirm the intended barangay mailbox before enabling real mail delivery. The permissive development content-security policies and large frontend bundle also need a deployment review.

The downloaded folder has no Git metadata, so there is no Git diff or commit for these local changes.
