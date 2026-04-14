// netlify/functions/ai-proxy.js
// Proxy para la API de Anthropic.
// La API key va en variables de entorno de Netlify (nunca en el frontend).
// Configura en: Netlify → Site → Environment variables → ANTHROPIC_API_KEY

exports.handler = async function(event) {
  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY no configurada en las variables de entorno de Netlify.' } })
    };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: `Error del proxy: ${err.message}` } }),
    };
  }
};
