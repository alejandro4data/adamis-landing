export const config = {
  matcher: ["/app/:path*", "/profesor/:path*"]
};

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Solo protegemos documentos. CSS, JS, imagenes, fuentes y datos deben poder
  // cargarse directamente; redirigirlos a splash rompe cada pantalla y multiplica
  // la latencia por asset.
  if (/\.(?:css|js|mjs|json|png|jpe?g|webp|avif|svg|gif|ico|woff2?|ttf|map|txt)$/i.test(pathname)) {
    return;
  }

  const cookies = request.headers.get("cookie") || "";
  const isProfesorRoute = pathname.startsWith("/profesor/");
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
