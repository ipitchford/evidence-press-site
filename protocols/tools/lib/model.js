'use strict';
/*
 * model.js — a dependency-free caller for the OpenAI /v1/responses endpoint,
 * used ONLY by the live evaluation runner (tools/run-eval.js). It is NOT part of
 * any protocol pack and never ships inside one — packs stay offline and
 * least-privilege. Reads OPENAI_API_KEY from the environment (source ~/.zprofile
 * before running). Apache-2.0.
 */
const https = require('https');

// Approximate USD per 1M tokens, for a rough cost estimate only. Labelled as an
// estimate wherever surfaced; do not treat as billing truth.
const PRICES = {
  'o4-mini':   { in: 1.10, out: 4.40 },
  'gpt-5.2':   { in: 1.25, out: 10.0 },
  'gpt-5.4':   { in: 2.00, out: 12.0 },
  'gpt-5.6-sol': { in: 3.0, out: 15.0 },
  '_default':  { in: 2.0, out: 10.0 }
};

function estimateCost(model, usage) {
  const p = PRICES[model] || PRICES._default;
  const inTok = usage.input_tokens || 0, outTok = usage.output_tokens || 0;
  return (inTok / 1e6) * p.in + (outTok / 1e6) * p.out;
}

function callModel(model, content, opts) {
  opts = opts || {};
  const timeoutMs = opts.timeoutMs || 180000;
  return new Promise((resolve, reject) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return reject(new Error('OPENAI_API_KEY not set — run: set -a; . ~/.zprofile; set +a'));
    const bodyObj = { model, input: [{ role: 'user', content }] };
    if (opts.maxOutputTokens) bodyObj.max_output_tokens = opts.maxOutputTokens;
    const body = JSON.stringify(bodyObj);
    const req = https.request('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(data);
          if (d.error) return reject(new Error('API error: ' + JSON.stringify(d.error)));
          let text = '';
          for (const item of d.output || []) if (item.type === 'message') for (const c of item.content || []) if (c.type === 'output_text') text += c.text;
          const usage = d.usage || {};
          resolve({ text: text.trim(), usage, cost_usd: estimateCost(model, usage), model: d.model || model, status: d.status });
        } catch (e) { reject(new Error('parse failed: ' + e.message + ' :: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error('request timeout after ' + timeoutMs + 'ms')));
    req.write(body);
    req.end();
  });
}

module.exports = { callModel, estimateCost, PRICES };
