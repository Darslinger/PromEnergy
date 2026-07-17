import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imagen, tipo } = JSON.parse(event.body || '{}');

    const prompt = tipo === 'recibo'
      ? 'Esta es una foto de un recibo de luz de Honduras de la ENEE. Extrae SOLO el número de consumo total en kWh del mes. Responde SOLO con el número, sin texto adicional. Ejemplo: 566'
      : 'Esta es una foto de un medidor eléctrico. Extrae SOLO el número que marca el medidor (lectura actual en kWh). Responde SOLO con el número, sin texto adicional. Ejemplo: 1234';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: imagen } }
            ]
          }]
        })
      }
    );

    const data = await response.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const numero = parseFloat(texto);

    if (isNaN(numero)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: 'No se pudo leer el número de la imagen' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ valor: numero })
    };
  } catch {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Error interno' })
  };
}
  }

export { handler };