Deno.serve(async (req) => {
  try {
    const body = await req.json();
    return new Response(JSON.stringify({
      status: 'placeholder',
      message: 'AI Chat function is not implemented yet.',
      received: body
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
