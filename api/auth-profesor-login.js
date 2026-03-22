export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const passwordReal = process.env.PASSWORD_PROTOTYPE_TEACHER;
  if (!passwordReal) {
    return res.status(500).send("PASSWORD_PROTOTYPE_TEACHER no está configurada");
  }

  const passwordInput = req.body?.password;

  if (passwordInput === passwordReal) {
    res.setHeader(
      "Set-Cookie",
      "acceso_adamis_profesor=permitido; Path=/; Max-Age=3600; SameSite=Lax; HttpOnly; Secure"
    );
    res.statusCode = 302;
    res.setHeader("Location", "/profesor/index.html");
    return res.end();
  }

  res.statusCode = 302;
  res.setHeader("Location", "/splash.html?error=teacher");
  return res.end();
}
