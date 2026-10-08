# Smart Complaint Management System (Node.js + Express + MongoDB)

Users file complaints (with a photo), an admin assigns them to staff, staff update the status,
and everyone gets email notifications. Admin also gets analytics numbers.

## Run it
1. Install Node.js and MongoDB (or make a free MongoDB Atlas database and copy its URI).
2. In this folder:
   ```
   npm install
   copy .env.example to .env   (then edit MONGO_URI / JWT_SECRET if needed)
   npm run seed                (creates admin@example.com / admin123 and staff@example.com / staff123)
   npm run dev
   ```
3. Open http://localhost:5000 -> "API is running".

## Test in Postman (in this order)
| # | Request | Notes |
|---|---------|-------|
| 1 | POST /api/auth/register | body JSON: name, email, password. Copy the `token` |
| 2 | POST /api/complaints | Header `Authorization: Bearer <token>`. Body = form-data: title, description, category, image (File) |
| 3 | GET /api/complaints/my | see your complaints |
| 4 | POST /api/auth/login as admin@example.com | copy admin token |
| 5 | GET /api/admin/staff | copy a staff `_id` |
| 6 | PUT /api/admin/complaints/:id/assign | body: `{ "staffId": "..." }` |
| 7 | POST /api/auth/login as staff@example.com | staff token |
| 8 | PUT /api/complaints/:id/status | body: `{ "status": "Resolved" }` |
| 9 | GET /api/admin/analytics | totals by status and category |

Emails: if EMAIL_USER / EMAIL_PASS are empty, emails are only printed in the terminal.

## Folder map
- `server.js` starts the app, `config/db.js` connects to MongoDB
- `models/` the shapes of data (User, Complaint)
- `routes/` the API endpoints (auth, complaints, admin)
- `middleware/auth.js` JWT check + role check, `middleware/upload.js` Multer image upload
- `utils/sendEmail.js` Nodemailer

## How to explain it in the interview
- **Flow:** user registers -> logs in -> gets a JWT -> sends it in the `Authorization` header on every request.
- **JWT:** a signed token that proves who you are, so the server doesn't need to store sessions.
- **Passwords:** hashed with bcrypt before saving, never stored as plain text.
- **Roles:** user, staff and admin. The `allowRoles` middleware blocks the wrong role with 403.
- **Multer:** handles file uploads (multipart form data); I allow only images up to 2 MB.
- **Nodemailer:** sends the email notifications when a complaint is created, assigned or updated.
- **Analytics:** MongoDB `aggregate` with `$group` counts complaints by status and category.
- **Mongoose `populate`:** replaces a stored id (like `user`) with the actual user's name and email.
