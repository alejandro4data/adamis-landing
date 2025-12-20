export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  // Vercel parsea form si viene como x-www-form-urlencoded o multipart.
  // Por seguridad, soportamos ambos casos:
  const passwordInput = req.body?.password;

  const passwordReal = process.env.PASSWORD_PROTOTYPE;

  if (!passwordReal) {
    return res.status(500).send("PASSWORD_PROTOTYPE no está configurada");
  }

  if (passwordInput === passwordReal) {
    // Cookie parecida a la tuya (1 hora)
    // OJO: en HTTPS, conviene añadir Secure.
    const cookie = [
      "acceso_adamis=permitido",
      "Path=/",
      "Max-Age=3600",
      "SameSite=Lax",
      "HttpOnly",
      "Secure"
    ].join("; ");

    res.setHeader("Set-Cookie", cookie);
    res.statusCode = 302;
    res.setHeader("Location", "/app/index.html");
    return res.end();
  }

  // Contraseña incorrecta
  res.statusCode = 302;
  res.setHeader("Location", "/splash.html?error=true");
  return res.end();
}
