import { sendLoginNotification } from './_login-notification.js';

export default async function handler(req, res) {
  const SESSION_MAX_AGE_SECONDS = 60 * 60;
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const passwordReal = process.env.PASSWORD_PROTOTYPE_TEACHER;
  if (!passwordReal) {
    return res.status(500).send("PASSWORD_PROTOTYPE_TEACHER no está configurada");
  }

  const passwordInput = req.body?.password;
  const secure = req.headers["x-forwarded-proto"] === "https" || process.env.VERCEL
    ? "; Secure"
    : "";

  if (passwordInput === passwordReal) {
    const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
    try {
      await sendLoginNotification({
        req,
        role: 'teacher',
        school: req.body?.centro,
        expiresAt
      });
    } catch (error) {
      console.error('Error enviando notificacion de login profesor:', error);
    }

    res.setHeader(
      "Set-Cookie",
      [
        `acceso_adamis_profesor=permitido; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax; HttpOnly${secure}`,
        `adamis_session_expires_at=${expiresAt}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`
      ]
    );
    res.statusCode = 302;
    res.setHeader("Location", "/profesor/index-profesor.html");
    return res.end();
  }

  res.statusCode = 302;
  res.setHeader("Location", "/splash.html?error=teacher");
  return res.end();
}
