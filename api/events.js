export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }

  const events = Array.isArray(body?.events) ? body.events : [];
  if (!events.length) {
    return res.status(400).json({ ok: false, error: 'No events provided' });
  }

  const safeEvents = events.slice(0, 50).map((event) => ({
    id: String(event?.id || ''),
    type: String(event?.type || 'event'),
    payload: event?.payload && typeof event.payload === 'object' ? event.payload : {},
    session_uuid: event?.session_uuid || null,
    student_uuid: event?.student_uuid || null,
    current_user: event?.current_user || null,
    centro: event?.centro || null,
    role: event?.role || null,
    path: event?.path || null,
    created_at: event?.created_at || new Date().toISOString(),
    received_at: new Date().toISOString()
  })).filter((event) => event.id);

  if (!safeEvents.length) {
    return res.status(400).json({ ok: false, error: 'Invalid events' });
  }

  const forwardUrl = process.env.EVENTS_WEBHOOK_URL || process.env.SHEETS_WEBAPP_URL;
  if (!forwardUrl) {
    return res.status(503).json({ ok: false, error: 'EVENTS_WEBHOOK_URL or SHEETS_WEBAPP_URL not set' });
  }

  const forward = await fetch(forwardUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'events',
      payload: { events: safeEvents }
    })
  });

  const text = await forward.text();
  if (!forward.ok) {
    return res.status(502).json({ ok: false, error: text || 'Forward failed' });
  }

  return res.status(200).json({ ok: true, accepted: safeEvents.length });
}
