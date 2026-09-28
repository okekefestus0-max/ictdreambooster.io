# ICT Dreambooster — freelance services landing page

A single-page, production-ready marketing site for **ICT Dreambooster**, a one-person creative
studio offering social media management, Facebook/Meta ad campaigns, UGC video content and
graphic design to small businesses abroad.

Live on GitHub Pages: `https://okekefestus0-max.github.io/`

## Sections

| Section | What it does |
| --- | --- |
| Hero | Core promise — one person for content, ads and creative — with animated stats and floating glass metric cards |
| Services | Four cards with full deliverable lists and entry pricing |
| How it works | Three-step onboarding, sets expectations before the form |
| Packages | Starter $450 / Growth $850 / Scale $1,450 per month, fixed deliverables + one-off add-ons |
| Work | Masonry portfolio with category filters and a lightbox holding brief + results per project |
| Results | Sample client case study (Nordhem Interiors) with before/after metrics and three testimonials |
| Contact | Three-step quote form that builds a pre-filled email / WhatsApp message |

## Files

```
index.html                 landing page (semantic HTML, JSON-LD, OG tags)
assets/css/style.css       design system, components, responsive + reduced-motion rules
assets/js/main.js          masonry, filters, lightbox, scroll reveal, counters, multi-step form
assets/img/*.webp|.jpg     hero, portfolio, studio and Open Graph imagery
.nojekyll                  lets GitHub Pages serve files/dirs starting with an underscore
```

## Contact details used throughout

- Email: `ictdreambooster@gmail.com` (every email CTA is a real `mailto:` link)
- WhatsApp: `+234 806 255 9689` (`https://wa.me/2348062559689`, prefilled messages)

## Notes

- No build step and no dependencies — open `index.html` or serve the folder.
- The quote form composes a structured summary and opens the visitor's mail client; the
  success panel also exposes **Send on WhatsApp** and **Open email app** fallbacks.
- Portfolio pieces and client results are illustrative demo work, as noted in the footer.
- Images are served as WebP with JPEG fallbacks via `<picture>`.

## Local preview

```bash
python3 -m http.server 8080
```
