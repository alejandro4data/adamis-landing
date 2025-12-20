export const config = { matcher: ["/app/:path*"] };

export default function middleware(request) {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("acceso_adamis=permitido")) {
    const url = new URL(request.url);
    url.pathname = "/splash.html";
    url.search = "";
    return Response.redirect(url, 302);
  }
  return; // continuar
}
