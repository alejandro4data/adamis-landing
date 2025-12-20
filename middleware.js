import { NextResponse } from "next/server";

export const config = {
  matcher: ["/app/:path*"],
};

export function middleware(request) {
  const cookie = request.cookies.get("acceso_adamis")?.value;

  // Si no hay cookie válida, fuera
  if (cookie !== "permitido") {
    const url = request.nextUrl.clone();
    url.pathname = "/splash.html";
    url.search = ""; // limpia query por si acaso
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
