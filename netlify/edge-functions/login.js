export default async (request, context) => {
  // Solo aceptamos peticiones POST (cuando envían el formulario)
  if (request.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  // 1. Leemos lo que ha escrito el usuario en el formulario
  const formData = await request.formData();
  const passwordInput = formData.get("password");

  // 2. Leemos la contraseña secreta del servidor
  const passwordReal = Deno.env.get("PASSWORD_PROTOTYPE");

  // 3. Comparamos
  if (passwordInput === passwordReal) {
    
    // --- ÉXITO: Creamos la cookie y redirigimos a la App ---
    const headers = new Headers({
      "Location": "/app/index.html", // Mandamos al usuario a la app
      "Set-Cookie": "acceso_adamis=permitido; Path=/; Max-Age=3600; SameSite=Lax; HttpOnly"
    });
    
    // Devolvemos una respuesta de redirección (302) con la cookie pegada
    return new Response(null, {
      status: 302,
      headers: headers
    });

  } else {
    // --- ERROR: Contraseña mal ---
    // Lo mandamos de vuelta al splash pero con un error en la URL
    return Response.redirect(new URL("/splash.html?error=true", request.url), 302);
  }
};