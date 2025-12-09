export default async (request, context) => {
  // 1. Buscamos si el navegador trae la cookie de autorización
  const cookies = request.headers.get("cookie") || "";
  
  // 2. Comprobamos si existe nuestra "marca" secreta
  // (Si NO incluye "acceso_adamis=permitido")
  if (!cookies.includes("acceso_adamis=permitido")) {
    
    // 3. ¡ALTO! No tiene permiso.
    // Lo redirigimos al splash inmediatamente.
    const url = new URL(request.url);
    // Redirige a /splash.html
    return Response.redirect(new URL("/splash.html", url), 302);
  }

  // 4. Si tiene la cookie, dejamos pasar la petición a la carpeta /app/
  return context.next();
};