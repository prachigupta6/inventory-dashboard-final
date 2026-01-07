import { withAuth } from "next-auth/middleware";

// This protects the entire application
export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if they aren't logged in
  },
});

// We only want to run this check on these specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (the login page itself)
     * - api/auth (auth endpoints)
     * - api/register (registration endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!login|api/auth|api/register|_next/static|_next/image|favicon.ico).*)",
  ],
};