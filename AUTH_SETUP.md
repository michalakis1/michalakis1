# Login + Role Security Setup

## 1) Start page
Set `login.html` as your first page.
After successful login, users are redirected to `home2.html`.

## 2) Keep current user in memory
`auth.js` stores session data in `sessionStorage`:
- `username`
- `role` (`admin`, `engineer`, `viewer`)
- `token`
- `expiresAt`

This is per-browser-tab memory and is cleared when the tab closes.

## 3) Add security line in every page
At the top of each protected page, include:

```html
<script src="auth.js"></script>
<script src="page_security.js"></script>
<script>
  // Example permissions
  guardPage(['admin', 'engineer']);
</script>
```

Examples:
- Overview page for all users: `guardPage(['admin','engineer','viewer'])`
- Engineer tools page: `guardPage(['admin','engineer'])`
- Admin page: `guardPage(['admin'])`

## 4) Node-RED backend (MySQL + encrypted passwords)
Files:
- `nodered/mysql_schema.sql`
- `nodered/user_management_flow.json`

### Install Node-RED dependencies
In your Node-RED user directory:

```bash
npm install bcryptjs
```

Then in `settings.js`, expose modules:

```js
functionGlobalContext: {
  bcryptjs:require('bcryptjs'),
  crypto:require('crypto')
}
```

### Security model
- Passwords are hashed with `bcrypt` (cost 12).
- Session tokens are random (32 bytes hex).
- Only SHA-256 hash of token is stored in DB.
- Raw token is returned once to frontend.

## 5) Optional API endpoint for page authorization check
You can add `GET /api/auth/me` in Node-RED:
1. Read `Authorization: Bearer <token>`.
2. Hash token with SHA-256.
3. Query `dashboard_sessions` + `dashboard_users`.
4. Verify `expires_at > NOW()`.
5. Return `{ username, role }`.

Use this if you want server-side confirmation before showing each page.
