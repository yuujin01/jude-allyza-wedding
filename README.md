# Jude & Allyza Wedding Website

This package connects the RSVP form to the Google Apps Script Web App configured in `app.js`.

## Deploy
Upload the contents of this folder to the existing GitHub repository / GitHub Pages site. Do not upload the private Google Sheet or its credentials. The guest list is queried from Apps Script and is not embedded in the website files.

## RSVP behavior
- Guests search using their exact registered full name (main guest or companion).
- All names in a household resolve to one shared group record.
- The form submits the main guest plus selected companions, within the group's allocated seats.
- Submitting again updates the existing group response row in `RSVP Responses`.

## Important testing note
The browser sends the RSVP request using a no-cors form POST because Apps Script ContentService responses are cross-origin. The page can confirm that the request was sent, but cannot read the server response. Verify actual submissions in the private Google Sheet's `RSVP Responses` tab before announcing the site.
