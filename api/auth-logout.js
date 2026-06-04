export default async function handler(req, res) {
  const secure = req.headers["x-forwarded-proto"] === "https" || process.env.VERCEL
    ? "; Secure"
    : "";

  res.setHeader("Set-Cookie", [
    `acceso_adamis_alumno=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly${secure}`,
    `acceso_adamis_profesor=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly${secure}`,
    `adamis_session_expires_at=; Path=/; Max-Age=0; SameSite=Lax${secure}`
  ]);

  res.statusCode = 302;
  res.setHeader("Location", "/splash.html");
  return res.end();
}
