# Jude & Allyza — Updated RSVP Guest List

This package updates the existing GitHub Pages website. It uses the current envelope / blended watercolor design and adds the latest supplied guest directory.

## Files
- `index.html`, `style.css`, `app.js` — website files
- `guests.json` — readable copy of the guest directory
- `assets/` — floral and couple artwork

## Guest-list rules applied
- Each name with a seat count starts a new guest group.
- Following names with blank seat counts are companions of that group until the next seat-count entry.
- `Vacant` is not a searchable guest; it represents an unused seat in the allocation.
- EVERY listed name is searchable: the main guest and every companion.
- Searching by a companion name resolves to the exact same household/group as searching by the main guest.
- Any member of a group can complete the one shared RSVP; the searcher name is retained in the RSVP preview.
- Companions can be edited or removed in the preview, and no more companion slots than the allocated seats are shown.

## Allocation audit
- Guest groups: 23
- Total allocated seats: 49
- Single-seat groups: 5
- Vacant slots explicitly listed: 3

## Important
The RSVP form currently generates a client-side confirmation preview only. It does not yet save responses to Google Sheets. The guest directory is bundled in the public website files for client-side lookup, so names are visible to anyone who inspects the site. For private guest data and persistent RSVP saving, connect a Google Sheets + Apps Script backend before publishing.

## Deploy
Upload/replace `index.html`, `app.js`, and `guests.json` in the repository. Keep the existing `style.css` and `assets/` from this package. Commit to `main` and `/ (root)` GitHub Pages.
