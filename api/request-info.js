function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  const audience = String(body?.audience || '').trim();
  const organization = String(body?.organization || '').trim();
  const message = String(body?.message || '').trim();

  if (!name || !email || !audience || !message) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios' });
  }

  const recipients = [
    'alejandro.jimenez@prospere.es',
    'eduardo.alconada@prospere.es'
  ];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: email,
      subject: `Nueva solicitud de informacion ADAMIS - ${audience}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #2b2311; line-height: 1.6;">
          <h2>Nueva solicitud de informacion</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Perfil:</strong> ${escapeHtml(audience)}</p>
          <p><strong>Centro / organizacion:</strong> ${escapeHtml(organization || 'No indicado')}</p>
          <p><strong>Mensaje:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
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
