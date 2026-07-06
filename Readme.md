[![Netlify Status](https://api.netlify.com/api/v1/badges/ea807c6b-ac5b-464e-b255-c9824c44354e/deploy-status)](https://app.netlify.com/projects/behzad-valipour/deploys)

# Behzad Valipour — Personal Website

Portfolio for **Behzad Valipour Shokouhi**, Data & Machine Learning Engineer.

**Live:** https://behzad-valipour.netlify.app

## Stack

Hand-built static site — no framework, no build step.

- `index.html` — single-page site (semantic HTML5, JSON-LD `Person` schema)
- `assets/css/main.css` — custom, theme-aware (light/dark) stylesheet with design tokens
- `assets/js/main.js` — dependency-free vanilla JS (theme toggle, scroll reveal, scroll-spy, typed rotator, Medium feed)

No jQuery, Bootstrap, AOS or other vendor libraries — the previous template stack was removed for performance and maintainability.

## Develop

Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pushes to `main` deploy to Netlify via GitHub Actions (`.github/workflows/ci.yml`).
