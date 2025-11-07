import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    console.log('Testing Google API directly...');
    console.log('API Key available:', !!apiKey);
    console.log('API Key length:', apiKey?.length);
    console.log('API Key prefix:', apiKey?.substring(0, 15));
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test direct API call to Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, respond with just "OK" if you can see this message.'
          }]
        }]
      })
    });

    console.log('Google API Response Status:', response.status);
    console.log('Google API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Google API Response Body:', responseText);

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'Google API Error',
        status: response.status,
        statusText: response.statusText,
        body: responseText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);
    
    return new Response(JSON.stringify({ 
      success: true,
      response: data,
      apiKeyWorking: true
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Test Google API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}