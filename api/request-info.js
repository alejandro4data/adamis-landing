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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Metodo no permitido' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return res.status(500).json({
      ok: false,
      error: 'Faltan RESEND_API_KEY o CONTACT_FROM_EMAIL'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const audience = String(body?.audience || 'Centro escolar').trim();
  const role = String(body?.role || '').trim();
  const courses = String(body?.courses || '').trim();
  const interest = String(body?.interest || '').trim();
  const organization = String(body?.organization || '').trim();
  const phone = String(body?.phone || '').trim();
  const message = String(body?.message || '').trim();
  const source = String(body?.source || '').trim();
  const hasExplicitConsentField = Object.prototype.hasOwnProperty.call(body || {}, 'dataConsent');
  const dataConsent = body?.dataConsent === true || body?.dataConsent === 'yes' || body?.dataConsent === 'true';
  const marketingConsent = body?.marketingConsent === true || body?.marketingConsent === 'yes' || body?.marketingConsent === 'true';

  if (!name || !email || !audience) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
  }

  if (hasExplicitConsentField && !dataConsent) {
    return res.status(400).json({ ok: false, error: 'Debes aceptar el tratamiento de datos' });
  }

  const requestSummary = [
    role ? `Cargo / perfil: ${role}` : '',
    organization ? `Centro educativo: ${organization}` : '',
    courses ? `Curso(s) de interes: ${courses}` : '',
    interest ? `Interes: ${interest}` : '',
    phone ? `Telefono / WhatsApp: ${phone}` : '',
    source ? `Origen: ${source}` : '',
    hasExplicitConsentField ? `Consentimiento datos: ${dataConsent ? 'Si' : 'No'}` : '',
    hasExplicitConsentField ? `Comunicaciones comerciales: ${marketingConsent ? 'Si' : 'No'}` : '',
    message ? `Mensaje: ${message}` : ''
  ].filter(Boolean).join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
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
          <p><strong>Consentimiento datos:</strong> ${hasExplicitConsentField ? (dataConsent ? 'Si' : 'No') : 'No indicado'}</p>
          <p><strong>Comunicaciones comerciales:</strong> ${hasExplicitConsentField ? (marketingConsent ? 'Si' : 'No') : 'No indicado'}</p>
          <p><strong>Resumen:</strong><br>${escapeHtml(requestSummary || 'Sin mensaje adicional').replace(/\n/g, '<br>')}</p>
        </div>
      `
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return res.status(502).json({
      ok: false,
      error: data?.message || 'Error enviando el correo'
    });
  }

  return res.status(200).json({ ok: true, id: data?.id || null });
}
