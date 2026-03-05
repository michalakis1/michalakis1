/**
 * Add this to each page:
 * <script src="auth.js"></script>
 * <script src="page_security.js"></script>
 * <script>
 *   guardPage(['admin', 'engineer']);
 * </script>
 */
function guardPage(allowedRoles = []) {
  if (!window.auth || !window.auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  if (allowedRoles.length > 0 && !window.auth.hasAnyRole(allowedRoles)) {
    document.body.innerHTML = '<h2 style="font-family:sans-serif;padding:20px">Access denied</h2>';
  }
}

window.guardPage = guardPage;
