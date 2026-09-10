# IT Service Desk & Ticket Management System

A professional, responsive IT Service Desk and Ticket Management System built with **React + TypeScript**, using **JSON Server** as a mock REST backend. It implements full CRUD operations, Role-Based Access Control (RBAC), ticket lifecycle management, assignment, comments, resolution tracking, activity history, search/filter/sort, pagination, and toast notifications.

## Technologies Used

- React 18 + TypeScript
- Vite
- React Router v6
- Axios
- JSON Server (mock backend)
- Plain CSS (no framework, custom design system)

## Project Structure

```
src/
├── components/       # ProtectedRoute, Layout, Modal
├── context/          # AuthContext, ToastContext
├── pages/            # Login, Dashboard, Tickets, TicketForm, TicketDetails,
│                      # Users, Categories, Profile, Reports
├── services/         # ticketService, userService, categoryService,
│                      # commentService, activityService (API layer)
├── types/            # Shared TypeScript interfaces
db.json               # JSON Server mock database
```

## Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start the mock backend (JSON Server) — Terminal 1
```bash
npm run server
```
This starts JSON Server at **http://localhost:3001** using `db.json`.

### 3. Start the React app — Terminal 2
```bash
npm run dev
```
This starts the app at **http://localhost:5173**.

> Both servers must be running at the same time. The frontend expects the API at `http://localhost:3001` (configured in `src/services/api.ts`).

### 4. Build for production
```bash
npm run build
```
Output is generated in the `dist/` folder.

## Login Credentials (Demo)

All demo accounts use the password: **`password123`**

| Role           | Email                  | Password      |
|----------------|-------------------------|---------------|
| Admin          | admin@example.com       | password123   |
| Support Agent  | agent@example.com       | password123   |
| Support Agent  | agent2@example.com      | password123   |
| Employee       | employee@example.com    | password123   |
| Employee       | employee2@example.com   | password123   |
| Inactive (test)| inactive@example.com    | password123   |

The `inactive@example.com` account is deliberately set to **Inactive** status to demonstrate login rejection for deactivated users.

## Role Permissions Summary

| Feature              | Admin | Support Agent | Employee |
|-----------------------|:-----:|:--------------:|:--------:|
| Dashboard              | Full  | Own Data       | Own Data |
| Create Ticket          | Yes   | Yes            | Yes      |
| View All Tickets       | Yes   | No             | No       |
| View Assigned Tickets  | Yes   | Yes            | No       |
| View Own Tickets       | Yes   | Yes            | Yes      |
| Edit Ticket            | Yes   | Assigned only  | Own & Open only |
| Delete Ticket          | Yes   | No             | No       |
| Assign / Reassign      | Yes   | No             | No       |
| Update Status          | Yes   | Assigned only  | Cancel Open / Reopen Resolved |
| Update Priority        | Yes   | Assigned only  | No       |
| Add Comments           | Yes   | Assigned only  | Own tickets only |
| Add Resolution         | Yes   | Assigned only  | No       |
| Manage Users           | Yes   | No             | No       |
| Manage Categories      | Yes   | No             | No       |

Unauthorized navigation (e.g. an Employee opening someone else's ticket URL directly, or a Support Agent opening a ticket not assigned to them) is blocked in the UI, not just hidden from menus.

## Ticket Lifecycle

```
Open → Assigned → In Progress → Pending → Resolved → Closed
Open → Cancelled
Pending → In Progress
Resolved → Reopened
```

Only the transitions valid for the logged-in user's role and the ticket's current status are shown in the "Update Status" dropdown on the Ticket Details page.

## API Endpoints (JSON Server)

**Users**
```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id   (PATCH used in app for partial updates)
DELETE /users/:id
```

**Tickets**
```
GET    /tickets
GET    /tickets/:id
POST   /tickets
PUT    /tickets/:id (PATCH used in app for partial updates)
DELETE /tickets/:id
```

**Comments**
```
GET    /comments?ticketId=:id
POST   /comments
DELETE /comments/:id
```

**Categories**
```
GET    /categories
POST   /categories
PUT    /categories/:id (PATCH used)
DELETE /categories/:id
```

**Activities** (ticket activity/history log — additional resource used for the Activity Timeline)
```
GET  /activities?ticketId=:id
POST /activities
```

## Key Features Implemented

- Login with email + password, validated against `db.json` users, blocked for inactive accounts.
- Role-based navigation, route protection, and in-page permission checks (not just hidden UI — direct URL access is also blocked).
- Role-specific dashboards with live counts from JSON Server data.
- Full ticket CRUD, search (ID/subject/employee/agent), filters (status/priority/category), sorting (newest/oldest/priority/recently updated), and pagination.
- Ticket assignment via a dedicated Assignment modal (Admin only) — assign, reassign, or unassign, with assignment date tracked.
- Comments with role-based add permissions.
- Resolution capture with resolution notes + resolution date, driving Resolved → Closed.
- Full Activity History timeline per ticket (created, assigned, status changes, comments, resolution, closed) in chronological order.
- User Management and Category Management (Admin-only) with Active/Inactive toggling.
- Toast notifications for create/update/delete/assignment/status-change actions.
- Loading, empty, and error states throughout.
- Fully responsive layout (sidebar collapses to a horizontal scroll nav on mobile).
- Reports page (Admin) with ticket breakdowns by status/priority/category/agent.
- Profile page for all roles.

## Deployment

The frontend can be deployed to **Netlify** or **Vercel**:

1. Push this repository to GitHub.
2. Connect the repo to Netlify/Vercel.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Since JSON Server is a local mock backend, for a live deployment you'll need to either:
   - Deploy `db.json` + JSON Server to a small Node host (e.g. Render, Railway) and update the `baseURL` in `src/services/api.ts` to that deployed URL, or
   - Use a JSON Server-compatible hosted mock (e.g. [mockapi.io](https://mockapi.io)) and update `baseURL` accordingly.

## Notes

- This app uses JSON Server as the **only** backend, per the project requirements — no external APIs are called.
- Passwords are stored in plain text in `db.json` for demo purposes only; this is a mock system and is not intended for production authentication use.
