export const config = { matcher: ["/app/:path*", "/profesor/:path*"] };

export default function middleware(request) {
  const cookies = request.headers.get("cookie") || "";
  const url = new URL(request.url);
  const isProfesorRoute = url.pathname.startsWith("/profesor/");
  const requiredCookie = isProfesorRoute
    ? "acceso_adamis_profesor=permitido"
    : "acceso_adamis_alumno=permitido";

  if (!cookies.includes(requiredCookie)) {
    url.pathname = "/splash.html";
    url.search = "";
    return Response.redirect(url, 302);
  }

  return;
}
