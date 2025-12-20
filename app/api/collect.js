export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const url = process.env.SHEETS_WEBAPP_URL;
  if (!url) return res.status(500).send("SHEETS_WEBAPP_URL not set");

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }

  const forward = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await forward.text();
  return res.status(200).send(text);
}
