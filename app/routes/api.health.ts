import { json, type LoaderFunctionArgs } from '@remix-run/node';

export const loader = async ({ request: _request }: LoaderFunctionArgs) => {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    return json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      debug: {
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV,
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length,
        apiKeyFirst10: apiKey?.substring(0, 10),
        apiKeyTrimmed: apiKey?.trim() === apiKey,
        apiKeyHasNewlines: apiKey?.includes('\n'),
        apiKeyHasQuotes: apiKey?.includes('"'),
      }
    });
  } catch (error: any) {
    return json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
