// pages/api/proxy-muapi.js

export default async function handler(req, res) {
  // Log method and incoming request for debugging
  // console.log(`[MuApi Proxy] ${req.method} ${req.url}`); // <-- Enable for debugging

  // Proxy POST to /generate_wan_ai_effects
  if (req.method === 'POST') {
    const muApiUrl = 'https://api.muapi.ai/api/v1/generate_wan_ai_effects';
    const apiKey = req.headers['x-api-key'];
    const payload = req.body;
    if (!apiKey) {
      res.status(400).json({ error: 'Missing x-api-key header' });
      return;
    }
    if (!payload || Object.keys(payload).length === 0) {
      res.status(400).json({ error: 'Missing or empty payload' });
      return;
    }
    try {
      // console.log('[MuApi Proxy] Forwarding payload:', payload); // <-- Enable for debugging
      const muApiRes = await fetch(muApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await muApiRes.json();
      } catch (jsonErr) {
        const text = await muApiRes.text();
        // console.error('[MuApi Proxy] Non-JSON response:', text); // <-- Enable for debugging
        res.status(muApiRes.status).json({ error: 'Non-JSON response from MuApi', details: text });
        return;
      }
      // console.log('[MuApi Proxy] MuApi response:', data); // <-- Enable for debugging
      res.status(muApiRes.status).json(data);
    } catch (error) {
      // console.error('[MuApi Proxy] Error:', error); // <-- Enable for debugging
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Proxy GET to /predictions/:id/result for video/status polling
  if (req.method === 'GET') {
    const { id } = req.query;
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      res.status(400).json({ error: 'Missing x-api-key header' });
      return;
    }
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }
    const muApiStatusUrl = `https://api.muapi.ai/api/v1/predictions/${id}/result`;
    try {
      // console.log(`[MuApi Proxy] Polling status for id: ${id}`); // <-- Enable for debugging
      const muApiRes = await fetch(muApiStatusUrl, {
        headers: { 'x-api-key': apiKey },
      });
      let data;
      try {
        data = await muApiRes.json();
      } catch (jsonErr) {
        const text = await muApiRes.text();
        // console.error('[MuApi Proxy] Non-JSON response:', text); // <-- Enable for debugging
        res.status(muApiRes.status).json({ error: 'Non-JSON response from MuApi', details: text });
        return;
      }
      // console.log('[MuApi Proxy] MuApi status response:', data); // <-- Enable for debugging
      res.status(muApiRes.status).json(data);
    } catch (error) {
      // console.error('[MuApi Proxy] Error:', error); // <-- Enable for debugging
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
