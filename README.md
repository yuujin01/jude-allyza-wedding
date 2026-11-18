# Jude & Allyza Wedding Website

This package connects the RSVP guest lookup and submissions to the Google Apps Script web app configured in `app.js`.

## Live name suggestions

The guest search field requests matching registered names as the visitor types (after 2 characters), then lets the visitor select a suggestion using the browser's native autocomplete list. Selecting a name performs the exact guest lookup and displays the shared invitation preview.

The Apps Script backend must include an `action=suggest` handler. Add the following inside `doGet(e)`, before the existing `search` branch:

```js
if (action === 'suggest') {
  result = suggestGuests(e.parameter.q || '');
} else if (action === 'search') {
  result = searchGuest(e.parameter.q || '');
} else {
  result = { ok: true, message: 'Jude & Allyza RSVP API is running.' };
}
```

Then add this function to `Code.gs`:

```js
function suggestGuests(query) {
  const q = normalize(query);
  if (q.length < 2) return { ok: true, suggestions: [] };

  const matches = [];
  for (const g of GUESTS) {
    for (const name of [g[0], ...g[2]]) {
      if (normalize(name).includes(q)) matches.push(name);
    }
  }
  return { ok: true, suggestions: [...new Set(matches)].slice(0, 8) };
}
```

After editing Apps Script, save and deploy a **new version** of the existing Web App deployment. Keep the Google Sheet private.

## Publish

Upload the contents of this ZIP to the existing GitHub Pages repository (not the ZIP file itself).
