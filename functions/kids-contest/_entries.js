// OE Kids Colouring Contest — entry registry.
// ADD NEW ENTRIES HERE when new drawings are added to the gallery.
// cat keys: "1-5", "6-11", "12-17"
export const ENTRIES = {
  1:  { name: "Lia",     age: "1",   cat: "1-5" },
  2:  { name: "Lena",    age: "2.5", cat: "1-5" },
  3:  { name: "Caleb",   age: "6",   cat: "6-11" },
  4:  { name: "Bella",   age: "7",   cat: "6-11" },
  5:  { name: "Ian",     age: "10",  cat: "6-11" },
  6:  { name: "Chelsea", age: "11",  cat: "6-11" },
  7:  { name: "Maddy",   age: "11",  cat: "6-11" },
  8:  { name: "Dominic", age: "11",  cat: "6-11" },
  9:  { name: "Ryan",    age: "13",  cat: "12-17" },
  10: { name: "Tyler",   age: "14",  cat: "12-17" },
  11: { name: "Sienna",  age: "16",  cat: "12-17" },
  12: { name: "Cameron", age: "4",   cat: "1-5" },
  13: { name: "Zoey",    age: "10",  cat: "6-11" },
  14: { name: "Kayden",  age: "8",   cat: "6-11" },
};

export const CATS = {
  "1-5":   "Ages 1\u20135",
  "6-11":  "Ages 6\u201311",
  "12-17": "Ages 12\u201317",
};

// Voting closes end of day August 9, 2026, Eastern Time.
export const VOTING_CLOSES_UTC = Date.parse("2026-08-10T03:59:59Z");

export function votingOpen() {
  return Date.now() <= VOTING_CLOSES_UTC;
}

export function pageShell(title, inner) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>${title} | OE Utility Services</title>
<style>
  :root{ --oe-navy:#0F2670; --oe-navy-bright:#062F87; --oe-blue:#01ABEE; --oe-green:#029449; --oe-gold:#EAB043; --oe-light:#F4F7FA; --oe-border:#D8E4EE; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body{ font-family:'Nunito Sans','Nunito',Arial,sans-serif; background:var(--oe-light); color:#1a2b4a; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card{ background:#fff; border:1px solid var(--oe-border); border-radius:16px; box-shadow:0 8px 24px rgba(15,38,112,.10); max-width:520px; width:100%; padding:36px 30px; text-align:center; }
  .card h1{ color:var(--oe-navy); font-size:24px; font-weight:900; margin-bottom:14px; }
  .card p{ font-size:16px; line-height:1.55; margin-bottom:12px; }
  .entry-line{ font-size:19px; font-weight:800; color:var(--oe-navy); margin:16px 0 22px; }
  .btn{ display:inline-block; padding:13px 34px; border:none; border-radius:28px; background:var(--oe-green); color:#fff; font-family:inherit; font-weight:800; font-size:16px; cursor:pointer; text-decoration:none; box-shadow:0 3px 0 rgba(0,0,0,.12); }
  .btn:hover{ opacity:.92; }
  .btn-back{ background:transparent; color:var(--oe-navy); box-shadow:none; font-weight:700; font-size:14px; text-decoration:underline; padding:10px; }
  .tick{ font-size:52px; color:var(--oe-green); line-height:1; margin-bottom:12px; }
  .warn{ font-size:44px; line-height:1; margin-bottom:12px; }
  .small{ font-size:13px; color:#5a6b8a; margin-top:18px; }
</style>
</head><body><div class="card">${inner}</div></body></html>`;
}
