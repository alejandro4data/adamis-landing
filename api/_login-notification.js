const LOGIN_NOTIFICATION_RECIPIENTS = [
  'alejandro.jimenez@prospere.es',
  'eduardo.alconada@prospere.es'
];

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstHeaderValue(value) {
  return String(Array.isArray(value) ? value[0] : value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0] || '';
}

function getClientIp(req) {
  return firstHeaderValue(req.headers['x-forwarded-for'])
    || firstHeaderValue(req.headers['x-real-ip'])
    || firstHeaderValue(req.socket?.remoteAddress);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Europe/Madrid'
  }).format(date);
}

export async function sendLoginNotification({
  req,
  role,
  school,
  expiresAt
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn('No se envia notificacion de login: faltan RESEND_API_KEY o CONTACT_FROM_EMAIL');
    return;
  }

  const now = new Date();
  const expiresAtDate = new Date(expiresAt);
  const roleLabel = role === 'teacher' ? 'Profesor' : 'Alumno';
  const schoolLabel = String(school || '').trim() || 'No indicado';
  const ip = getClientIp(req) || 'No disponible';
  const userAgent = firstHeaderValue(req.headers['user-agent']) || 'No disponible';
  const referer = firstHeaderValue(req.headers.referer || req.headers.referrer) || 'No disponible';
  const host = firstHeaderValue(req.headers.host) || 'No disponible';
  const forwardedProto = firstHeaderValue(req.headers['x-forwarded-proto']) || 'No disponible';
  const requestId = firstHeaderValue(req.headers['x-vercel-id']) || 'No disponible';
  const loginUrl = `${forwardedProto === 'No disponible' ? 'https' : forwardedProto}://${host}${req.url || ''}`;

  const rows = [
    ['Vista', roleLabel],
    ['Centro', schoolLabel],
    ['Fecha/hora Madrid', formatDate(now)],
    ['Fecha/hora ISO', now.toISOString()],
    ['Expira Madrid', formatDate(expiresAtDate)],
    ['Expira ISO', expiresAtDate.toISOString()],
    ['IP', ip],
    ['User-Agent', userAgent],
    ['Origen / Referer', referer],
    ['Host', host],
    ['Protocolo', forwardedProto],
    ['URL endpoint', loginUrl],
    ['Request ID', requestId]
  ];

  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #eee;background:#faf7ed;">${escapeHtml(label)}</th>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td>
    </tr>
  `).join('');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: LOGIN_NOTIFICATION_RECIPIENTS,
      subject: `Nuevo login ADAMIS - ${roleLabel} - ${schoolLabel}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; color: #2b2311; line-height: 1.5;">
          <h2>Nuevo inicio de sesion en ADAMIS</h2>
          <table style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #eee;">
            <tbody>${htmlRows}</tbody>
          </table>
        </div>
      `
    })
  }).finally(() => clearTimeout(timeout));

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Error enviando notificacion de login (${response.status})`);
  }
}
