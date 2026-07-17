function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CONTACT_RECIPIENTS = (process.env.CONTACT_TO_EMAIL || 'contacto@adamis.es')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);

function readField(body, key, maxLength = 500) {
  return String(body?.[key] || '').trim().slice(0, maxLength);
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 160;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Metodo no permitido' });
  }

  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (contentLength > 100_000) {
    return res.status(413).json({ ok: false, error: 'Solicitud demasiado grande' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      try {
        body = Object.fromEntries(new URLSearchParams(body));
      } catch {
        body = null;
      }
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ ok: false, error: 'Solicitud no valida' });
  }

  // Honeypot: return a neutral success so automated senders do not retry.
  if (readField(body, 'website', 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = readField(body, 'name', 100);
  const email = readField(body, 'email', 160).toLowerCase();
  const audience = (readField(body, 'audience', 80) || 'Centro escolar').replace(/[\r\n]+/g, ' ');
  const role = readField(body, 'role', 100);
  const courses = readField(body, 'courses', 160);
  const interest = readField(body, 'interest', 160).replace(/[\r\n]+/g, ' ');
  const organization = readField(body, 'organization', 140);
  const phone = readField(body, 'phone', 40);
  const message = readField(body, 'message', 1200);
  const source = readField(body, 'source', 500);
  const dataConsent = body?.dataConsent === true || body?.dataConsent === 'yes' || body?.dataConsent === 'true';
  const marketingConsent = body?.marketingConsent === true || body?.marketingConsent === 'yes' || body?.marketingConsent === 'true';

  if (!name || !email || !audience || !organization) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'El email no es valido' });
  }

  if (!dataConsent) {
    return res.status(400).json({ ok: false, error: 'Debes aceptar el tratamiento de datos' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return res.status(503).json({
      ok: false,
      error: 'El formulario no esta disponible temporalmente'
    });
  }

  const requestSummary = [
    role ? `Cargo / perfil: ${role}` : '',
    organization ? `Centro educativo: ${organization}` : '',
    courses ? `Curso(s) de interes: ${courses}` : '',
    interest ? `Interes: ${interest}` : '',
    phone ? `Telefono / WhatsApp: ${phone}` : '',
    source ? `Origen: ${source}` : '',
    `Consentimiento datos: ${dataConsent ? 'Si' : 'No'}`,
    `Comunicaciones comerciales: ${marketingConsent ? 'Si' : 'No'}`,
    message ? `Mensaje: ${message}` : ''
  ].filter(Boolean).join('\n');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);
  let response;
  let data;

  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        from,
        to: CONTACT_RECIPIENTS,
        reply_to: email,
        subject: interest
          ? `Nueva solicitud de informacion ADAMIS - ${audience} - ${interest}`
          : `Nueva solicitud de informacion ADAMIS - ${audience}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #2b2311; line-height: 1.6;">
            <h2>Nueva solicitud de informacion</h2>
            <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Perfil:</strong> ${escapeHtml(audience)}</p>
            <p><strong>Cargo:</strong> ${escapeHtml(role || 'No indicado')}</p>
            <p><strong>Producto:</strong> ${escapeHtml(interest || 'No indicado')}</p>
            <p><strong>Curso(s):</strong> ${escapeHtml(courses || 'No indicado')}</p>
            <p><strong>Centro / organizacion:</strong> ${escapeHtml(organization || 'No indicado')}</p>
            <p><strong>Telefono / WhatsApp:</strong> ${escapeHtml(phone || 'No indicado')}</p>
            <p><strong>Origen:</strong> ${escapeHtml(source || 'No indicado')}</p>
            <p><strong>Consentimiento datos:</strong> ${dataConsent ? 'Si' : 'No'}</p>
            <p><strong>Comunicaciones comerciales:</strong> ${marketingConsent ? 'Si' : 'No'}</p>
            <p><strong>Resumen:</strong><br>${escapeHtml(requestSummary || 'Sin mensaje adicional').replace(/\n/g, '<br>')}</p>
          </div>
        `
      })
    });
    data = await response.json().catch(() => null);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error?.name === 'AbortError' ? 'El envio ha tardado demasiado' : 'No se pudo enviar la solicitud'
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    return res.status(502).json({
      ok: false,
      error: data?.message || 'Error enviando el correo'
    });
  }

  return res.status(200).json({ ok: true, id: data?.id || null });
}
