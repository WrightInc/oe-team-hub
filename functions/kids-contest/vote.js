// OE Kids Colouring Contest — vote handler
// GET  /kids-contest/vote?entry=N  -> confirmation screen
// POST /kids-contest/vote          -> records the vote, shows thank-you
import { ENTRIES, CATS, votingOpen, pageShell } from "./_entries.js";

const IP_CAP_PER_CATEGORY = 10;

function getCookie(request, name) {
  const h = request.headers.get("Cookie") || "";
  const m = h.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : null;
}

function closedPage() {
  return pageShell("Voting Closed", `
    <div class="warn">&#128683;</div>
    <h1>Voting has closed</h1>
    <p>Employee voting ended on August 9, 2026. Winners will be announced on August 10, 2026.</p>
    <a class="btn btn-back" href="/kids-contest/gallery/">&larr; Back to the Gallery</a>`);
}

function alreadyVotedPage(catLabel) {
  return pageShell("Already Voted", `
    <div class="warn">&#9995;</div>
    <h1>You've already voted</h1>
    <p>One vote per employee, per category &mdash; and your vote in the <strong>${catLabel}</strong> category has already been recorded.</p>
    <a class="btn btn-back" href="/kids-contest/gallery/">&larr; Back to the Gallery</a>`);
}

function badRequest() {
  return new Response(pageShell("Not Found", `
    <h1>Entry not found</h1>
    <p>That entry number doesn't exist.</p>
    <a class="btn btn-back" href="/kids-contest/gallery/">&larr; Back to the Gallery</a>`),
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const n = parseInt(url.searchParams.get("entry"), 10);
  const e = ENTRIES[n];
  if (!e) return badRequest();

  if (!votingOpen())
    return new Response(closedPage(), { headers: { "Content-Type": "text/html; charset=utf-8" } });

  if (getCookie(context.request, "oe_vote_" + e.cat))
    return new Response(alreadyVotedPage(CATS[e.cat]), { headers: { "Content-Type": "text/html; charset=utf-8" } });

  const body = pageShell("Confirm Your Vote", `
    <h1>Confirm your vote</h1>
    <p>You're voting in the <strong>${CATS[e.cat]}</strong> category for:</p>
    <p class="entry-line">Entry #${n} &mdash; ${e.name}, Aged ${e.age}</p>
    <form method="POST" action="/kids-contest/vote">
      <input type="hidden" name="entry" value="${n}">
      <button class="btn" type="submit">Confirm my vote</button>
    </form>
    <a class="btn btn-back" href="/kids-contest/gallery/">Cancel &mdash; back to the Gallery</a>
    <p class="small">One vote per employee, per category. Voting closes end of day August 9, 2026.</p>`);
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function onRequestPost(context) {
  const form = await context.request.formData();
  const n = parseInt(form.get("entry"), 10);
  const e = ENTRIES[n];
  if (!e) return badRequest();

  if (!votingOpen())
    return new Response(closedPage(), { headers: { "Content-Type": "text/html; charset=utf-8" } });

  if (getCookie(context.request, "oe_vote_" + e.cat))
    return new Response(alreadyVotedPage(CATS[e.cat]), { headers: { "Content-Type": "text/html; charset=utf-8" } });

  const kv = context.env.KIDS_VOTES;
  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";

  // Per-IP cap per category (generous so shared yard connections aren't blocked)
  const ipKey = "ipcap:" + e.cat + ":" + ip;
  const ipCount = parseInt((await kv.get(ipKey)) || "0", 10);
  if (ipCount >= IP_CAP_PER_CATEGORY)
    return new Response(alreadyVotedPage(CATS[e.cat]), { headers: { "Content-Type": "text/html; charset=utf-8" } });

  // Record the vote
  const voteKey = "votes:" + n;
  const current = parseInt((await kv.get(voteKey)) || "0", 10);
  await kv.put(voteKey, String(current + 1));
  await kv.put(ipKey, String(ipCount + 1));

  const expires = new Date("2026-08-10T04:00:00Z").toUTCString();
  const body = pageShell("Vote Recorded", `
    <div class="tick">&#10003;</div>
    <h1>Your vote has been recorded</h1>
    <p>Thank you for voting for <strong>Entry #${n} &mdash; ${e.name}, Aged ${e.age}</strong> in the ${CATS[e.cat]} category.</p>
    <p>Winners will be announced on August 10, 2026.</p>
    <a class="btn" href="/kids-contest/gallery/">Back to the Gallery</a>`);
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": `oe_vote_${e.cat}=1; Path=/; Expires=${expires}; SameSite=Lax; Secure`,
    },
  });
}
