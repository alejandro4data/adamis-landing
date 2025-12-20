export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const passwordReal = process.env.PASSWORD_PROTOTYPE;
  if (!passwordReal) {
    return res.status(500).send("PASSWORD_PROTOTYPE no está configurada");
  }

  // Si tu form es x-www-form-urlencoded, Vercel suele parsearlo en req.body
  const passwordInput = req.body?.password;

  if (passwordInput === passwordReal) {
    // Igual que Netlify: cookie y redirect
    res.setHeader(
      "Set-Cookie",
      "acceso_adamis=permitido; Path=/; Max-Age=3600; SameSite=Lax; HttpOnly; Secure"
    );
    res.statusCode = 302;
    res.setHeader("Location", "/app/index.html");
    return res.end();
  }

  res.statusCode = 302;
  res.setHeader("Location", "/splash.html?error=true");
  return res.end();
}
