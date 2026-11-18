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

## Main Guest follows the person who searches

The selected registered name becomes the Main Guest in the RSVP preview and is placed first in the attending names. The other registered member(s) in the same group are shown as companions. The group ID and seat allocation remain unchanged, so the group still has one shared RSVP record.

### Apps Script update for the Google Sheet's Main Guest column

In `doPost(e)`, find the `record` array and replace its third value (`g[0]`) with the submitted guest name. Use this complete record block:

```js
const submittedBy = String(params.submittedBy || '').trim();
const record = [
  new Date(),
  groupId,
  submittedBy || g[0],
  submittedBy,
  status,
  names.join(', '),
  names.length
];
```

This makes the `Main Guest` and `Submitted By` columns show the member who actually searched and submitted the RSVP. Save, then deploy a **new version** of the existing Web App deployment so the same URL stays active.

## Wedding background music

The invitation includes the supplied YouTube video (`DD7MVBL0ei0`) in a visible embedded player with looping enabled. The page attempts autoplay when it loads and sends a play command on the visitor's first interaction (for example, opening the envelope). Audible autoplay is controlled by each visitor's browser/device and cannot be guaranteed. The player remains on the page while visitors browse and complete the RSVP. YouTube may show its own controls or ads, and playback depends on the video owner's embedding settings and availability.
