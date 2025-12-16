import { put, list } from '@vercel/blob';

export default async function handler(request: Request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Check for environment variable
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN is missing. Did you connect the Blob store in Vercel?' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const filename = 'bucket-list.json';

  try {
    if (request.method === 'GET') {
      const { blobs } = await list({ prefix: filename, limit: 1 });
      const blob = blobs.find((b) => b.pathname === filename);

      if (!blob) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Fetch the JSON from the blob URL
      const response = await fetch(blob.url);
      if (!response.ok) {
         throw new Error('Failed to fetch blob file');
      }
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      const data = await request.json();

      await put(filename, JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}