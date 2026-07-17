import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imagen, tipo } = JSON.parse(event.body || '{}');

    const prompt = tipo === 'recibo'
      ? `Analiza esta imagen de un recibo de electricidad de Honduras de la ENEE. 
         Busca el campo que dice "CONSUMO (kWh)" o "Consumo" y extrae ese número.
         Responde ÚNICAMENTE con el número entero, sin unidades ni texto. 
         Ejemplo de respuesta correcta: 566`
      : `Analiza esta imagen de un medidor eléctrico.
         Extrae la lectura actual que muestran los dígitos del medidor.
         Responde ÚNICAMENTE con el número, sin unidades ni texto.
         Ejemplo de respuesta correcta: 1234`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: imagen } }
            ]
          }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 50
          }
        })
      }
    );

    const data = await response.json();
    console.log('Respuesta Gemini:', JSON.stringify(data));
    
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log('Texto extraído:', texto);
    
    const numero = parseFloat(texto?.replace(/[^0-9.]/g, '') || '');
    console.log('Número parseado:', numero);

    if (isNaN(numero)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          error: 'No se pudo leer el número de la imagen',
          debug: texto
        })
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
};

export { handler };