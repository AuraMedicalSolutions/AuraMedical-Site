# auramedical.ca

Static pre-launch site for AuraMed and SilverCore™. No build step: every file here is served as-is by Cloudflare Pages.

- `index.html`: homepage
- `privacy.html`: privacy policy
- `404.html`: not-found page
- `assets/css/site.css`: all styles
- `assets/js/site.js`: menu, fibre slider, drawing markers, early-access form
- `_headers`: security headers for Cloudflare Pages

## Before launch
1. Paste the Kit form ID into `KIT_FORM_ID` at the top of `assets/js/site.js`.
2. Add the company mailing address where the `TODO` comments are in `index.html` and `privacy.html`.
3. Get Noble Biomaterials' sign-off on the Ionic+™ name and claims wording.
