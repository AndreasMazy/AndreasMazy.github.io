const CONTACT_MAP = {
    email: 'CONTACT_EMAIL',
    phone: 'CONTACT_PHONE',
    qq: 'CONTACT_QQ',
    wechat: 'CONTACT_WeChat',
    whatsapp: 'CONTACT_WHATSAPP'
};

const ALLOWED_ORIGINS = new Set([
    'https://andreasma.qzz.io',
    'https://www.andreasma.qzz.io'
]);

function corsHeaders(origin) {
    const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://andreasma.qzz.io';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin'
    };
}

function json(data, status = 200, origin = '') {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders(origin)
        }
    });
}

async function verifyTurnstile(token, env, request) {
    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);

    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) formData.append('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData
    });

    return response.json();
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(origin)
            });
        }

        const url = new URL(request.url);
        if (request.method !== 'POST' || url.pathname !== '/reveal') {
            return json({ error: 'Not found' }, 404, origin);
        }

        let payload;
        try {
            payload = await request.json();
        } catch {
            return json({ error: 'Invalid JSON body' }, 400, origin);
        }

        const { type, token } = payload;
        const envKey = CONTACT_MAP[type];
        if (!envKey) {
            return json({ error: 'Invalid contact type' }, 400, origin);
        }

        if (!token) {
            return json({ error: 'Missing Turnstile token' }, 400, origin);
        }

        if (!env.TURNSTILE_SECRET_KEY) {
            return json({ error: 'Missing TURNSTILE_SECRET_KEY' }, 500, origin);
        }

        const verification = await verifyTurnstile(token, env, request);
        if (!verification.success) {
            return json({ error: 'Turnstile verification failed' }, 403, origin);
        }

        const value = env[envKey];
        if (!value) {
            return json({ error: `Missing ${envKey}` }, 500, origin);
        }

        return json({ type, value }, 200, origin);
    }
};
