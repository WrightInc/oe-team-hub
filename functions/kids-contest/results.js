// OE Kids Colouring Contest — COMMITTEE-ONLY results page
// /kids-contest/results — Basic Auth: Kids / Numbers123
import { ENTRIES, CATS, votingOpen } from "./_entries.js";

const USER = "Kids";
const PASS = "Numbers123";

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="OE Contest Results"' },
  });
}

export async function onRequestGet(context) {
  // --- Basic Auth ---
  const auth = context.request.headers.get("Authorization") || "";
  if (!auth.startsWith("Basic ")) return unauthorized();
  let user = "", pass = "";
  try {
    [user, pass] = atob(auth.slice(6)).split(":");
  } catch { return unauthorized(); }
  if (user !== USER || pass !== PASS) return unauthorized();

  // --- Gather counts ---
  const kv = context.env.KIDS_VOTES;
  const rows = {};
  for (const key of Object.keys(CATS)) rows[key] = [];
  for (const [n, e] of Object.entries(ENTRIES)) {
    const count = parseInt((await kv.get("votes:" + n)) || "0", 10);
    rows[e.cat].push({ n: parseInt(n, 10), name: e.name, age: e.age, count });
  }

  const status = votingOpen()
    ? '<span class="pill open">Voting open &mdash; closes end of day August 9, 2026</span>'
    : '<span class="pill closed">Voting closed</span>';

  let sections = "";
  for (const [key, label] of Object.entries(CATS)) {
    const list = rows[key].sort((a, b) => b.count - a.count || a.n - b.n);
    const total = list.reduce((s, r) => s + r.count, 0);
    const tr = list.map((r, i) => `
      <tr class="${i === 0 && r.count > 0 ? "lead" : ""}">
        <td>Entry #${r.n}</td><td>${r.name}, Aged ${r.age}</td><td class="c">${r.count}</td>
      </tr>`).join("");
    sections += `
      <h2>${label} <span class="tot">${total} vote${total === 1 ? "" : "s"} cast</span></h2>
      <table><thead><tr><th>Entry</th><th>Artist</th><th class="c">Votes</th></tr></thead>
      <tbody>${tr}</tbody></table>`;
  }

  const body = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Contest Vote Results | OE Utility Services</title>
<style>
  :root{ --oe-navy:#0F2670; --oe-blue:#01ABEE; --oe-green:#029449; --oe-light:#F4F7FA; --oe-border:#D8E4EE; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body{ font-family:'Nunito Sans','Nunito',Arial,sans-serif; background:var(--oe-light); color:#1a2b4a; padding:36px 18px; }
  .wrap{ max-width:640px; margin:0 auto; }
  h1{ color:var(--oe-navy); font-size:26px; font-weight:900; margin-bottom:6px; }
  .sub{ color:#5a6b8a; font-size:14px; margin-bottom:8px; }
  .pill{ display:inline-block; font-size:12px; font-weight:800; padding:4px 12px; border-radius:14px; margin-bottom:22px; }
  .pill.open{ background:#e3f6ec; color:var(--oe-green); }
  .pill.closed{ background:#fdeeee; color:#b03030; }
  h2{ color:var(--oe-navy); font-size:19px; font-weight:900; margin:26px 0 10px; }
  .tot{ font-size:13px; font-weight:700; color:#5a6b8a; }
  table{ width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--oe-border); border-radius:10px; overflow:hidden; }
  th,td{ padding:10px 14px; text-align:left; font-size:15px; border-bottom:1px solid var(--oe-border); }
  th{ background:var(--oe-navy); color:#fff; font-size:13px; }
  .c{ text-align:center; }
  tr.lead td{ background:#f0faf4; font-weight:800; }
  .note{ font-size:12px; color:#5a6b8a; margin-top:24px; }
</style>
</head><body><div class="wrap">
  <h1>Kids Colouring Contest &mdash; Vote Results</h1>
  <p class="sub">Committee use only. Counts update live as votes are recorded.</p>
  ${status}
  ${sections}
  <p class="note">This page is private. Please don't share the link or password outside the social committee. &copy; 2026 OE Utility Services. Confidential.</p>
</div></body></html>`;
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
