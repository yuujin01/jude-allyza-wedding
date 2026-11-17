# Jude & Allyza Wedding Invitation — deployment package

## Included
- `index.html`, `style.css`, `app.js`: responsive invitation and RSVP UI.
- `config.js`: paste your deployed Apps Script URL here.
- `Code.gs`: Google Apps Script backend; `setup()` creates both sheets and seeds 10 main-guest records with random invitation codes.
- `guests.seed.json`: parsed guest data for review.
- `assets/`: add the supplied original couple illustration as `couple-transparent.png`.

## Important guest-list interpretation
The right-hand list in the workbook contains 10 main guests with allocated seats totaling 27. Names without a seat count are treated as suggested companions until the next allocated main guest. `Vacant` placeholders are not attendee names; the Francis Jarque invitation retains two unassigned companion slots within its five-seat allocation.

## Google Sheets setup
1. Create a new Google Sheet.
2. Open Extensions → Apps Script and paste `Code.gs`.
3. Save, select `setup`, and Run. Authorize the script. It creates `Guest Database` and `RSVP Responses`.
4. Copy the unique invitation codes from the Guest Database sheet and distribute them privately to each main guest. Do not publish this sheet.
5. Deploy → New deployment → Web app. Execute as **Me**. Access: **Anyone** (the API still requires each guest's private code for lookup and submission). Copy the `/exec` URL.
6. Paste the URL into `config.js` as `API_URL`.
7. Host this folder on Netlify, GitHub Pages, or another static host. Do not upload `Code.gs` or the guest seed file to a public repository. For a public deployment, remove `guests.seed.json` after verifying the data; the Apps Script code contains the seed data and should remain private.
8. Test with a guest code, update RSVP, and verify both sheets.

## Security notes / limitations
- Invitation codes are generated during `setup()` and act as bearer secrets. Deliver each code privately.
- The public suggestions endpoint currently returns registered names to support type-ahead. For stricter privacy, change it to a prefix-search endpoint with rate limiting or require a code before returning names. Apps Script does not provide robust IP rate limiting; a production deployment with higher security requirements should use a dedicated backend.
- The backend uses a script lock and upserts one response per main guest. Guests can update their RSVP by submitting again with their invitation code.
- The website is a deployment-ready starter, not yet a live published website. Google authorization, web-app deployment, and hosting must be completed by the account owner.
- Confirm official map pins, schedule, attire language, and guest allocations before publication.
