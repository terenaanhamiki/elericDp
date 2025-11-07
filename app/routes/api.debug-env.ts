import type { ActionFunctionArgs } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    return new Response(JSON.stringify({
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      apiKeyFirst10: apiKey?.substring(0, 10),
      apiKeyLast5: apiKey?.substring(-5),
      apiKeyHasNewlines: apiKey?.includes('\n'),
      apiKeyHasQuotes: apiKey?.includes('"'),
      apiKeyTrimmed: apiKey?.trim() === apiKey,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}