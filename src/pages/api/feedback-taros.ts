import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  console.log('POST request received for feedback-taros');
  
  try {
    const body = await request.text();
    console.log('Raw body length:', body.length);
    console.log('Raw body:', body);
    
    if (!body || body.trim() === '') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Empty request body' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = JSON.parse(body);
    console.log('Parsed data:', data);
    
    const { name, contact, description } = data;

    if (!name || !contact || !description) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending data to Strapi...');
    
    const strapiResponse = await fetch('http://31.131.17.148:1337/api/feedback-taros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: name,
          contact: contact,
          description: description
        }
      })
    });

    console.log('Strapi response status:', strapiResponse.status);
    
    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error('Strapi error:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Strapi error: ${strapiResponse.status} - ${errorText}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const strapiResult = await strapiResponse.json();
    console.log('Strapi response:', strapiResult);
    
    return new Response(JSON.stringify({ 
      success: true,
      strapiData: strapiResult
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 