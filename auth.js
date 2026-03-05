const AUTH_API_BASE = 'http://localhost:1880/api/auth';

function saveSession(session) {
  sessionStorage.setItem('dashboardSession', JSON.stringify(session));
}

function getSession() {
  const raw = sessionStorage.getItem('dashboardSession');
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  sessionStorage.removeItem('dashboardSession');
}

async function login(username, password) {
  const response = await fetch(`${AUTH_API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  saveSession({
    token: data.token,
    username: data.username,
    role: data.role,
    expiresAt: data.expiresAt
  });
  return data;
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function isLoggedIn() {
  const session = getSession();
  if (!session) return false;
  if (!session.expiresAt) return true;
  return new Date(session.expiresAt).getTime() > Date.now();
}

function hasAnyRole(roles = []) {
  const session = getSession();
  if (!session) return false;
  return roles.includes(session.role);
}

async function attachLoginForm() {
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) return;

  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error');

    errorEl.textContent = '';

    if (!username || !password) {
      errorEl.textContent = 'Please enter username and password.';
      return;
    }

    try {
      await login(username, password);
      window.location.href = 'home2.html';
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}

attachLoginForm();

window.auth = {
  getSession,
  isLoggedIn,
  hasAnyRole,
  logout,
  login
};
