import { sendLoginNotification } from './_login-notification.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Metodo no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  const password = String(body?.password || '');
  const isAuthorized = password
    && (password === process.env.PASSWORD_PROTOTYPE || password === process.env.PASSWORD_PROTOTYPE_TEACHER);

  if (!isAuthorized) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }

  try {
    const result = await sendLoginNotification({
      req,
      role: body?.role === 'teacher' ? 'teacher' : 'student',
      school: body?.centro || 'Prueba manual',
      expiresAt: Date.now() + 60 * 60 * 1000
    });

    return res.status(200).json({ ok: true, result });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error?.message || 'Error enviando notificacion de prueba',
      env: {
        hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
        hasContactFromEmail: Boolean(process.env.CONTACT_FROM_EMAIL)
      }
    });
  }
}
