const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (req.method !== 'POST') {
    return json({ ok: false, detail: 'Method not allowed.', aiError: 'Method not allowed.' }, 405);
  }

  try {
    const body = await readJson(req);
    const message = isRecord(body) ? text(body.message) : null;
    const context = isRecord(body) ? text(body.context) ?? 'general' : 'general';
    const task = isRecord(body) && body.task === 'nutrition_plan' || context === 'nutrition' ? 'nutrition_plan' : 'ai_chat';

    if (!message) {
      return json(
        {
          ok: false,
          detail: 'Invalid chat payload',
          aiError: 'Message is required.'
        },
        400
      );
    }

    return json({
      ok: false,
      detail: 'AI chat provider is not configured',
      aiError:
        task === 'nutrition_plan'
          ? 'Nutrition plan generation is temporarily unavailable until the DeepSeek provider is connected.'
          : 'AI chat is temporarily unavailable until the DeepSeek provider is connected.'
    });
  } catch (error) {
    return json(
      {
        ok: false,
        detail: 'AI chat request failed',
        aiError: error instanceof Error ? error.message : String(error)
      },
      500
    );
  }
});

async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
