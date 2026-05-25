# GitHub Pages deployment checklist — Raw Materials Trade Kft.

## Upload structure

Upload the **contents** of this folder to the GitHub repository root. The repository root should contain:

- `index.html`
- `en.html`
- `hu.html`
- `de-at.html`
- `style.css`
- `main.js`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `ai-company-profile.json`
- `CNAME`
- `.nojekyll`
- all product HTML pages
- image and certificate files

Do not upload the whole folder as a nested folder unless GitHub Pages is configured to serve from that folder.

## GitHub Pages settings

Repository → Settings → Pages:

- Source: Deploy from a branch
- Branch: main
- Folder: /root
- Custom domain: `www.rawmaterialstrade.com`
- Enforce HTTPS: ON, when available

## DNS already expected

A records for apex domain:

- `@ → 185.199.108.153`
- `@ → 185.199.109.153`
- `@ → 185.199.110.153`
- `@ → 185.199.111.153`

CNAME for www:

- `www → strangerfake01.github.io`

## After publish

Test these URLs:

- https://www.rawmaterialstrade.com/
- https://www.rawmaterialstrade.com/en.html
- https://www.rawmaterialstrade.com/hu.html
- https://www.rawmaterialstrade.com/de-at.html
- https://www.rawmaterialstrade.com/robots.txt
- https://www.rawmaterialstrade.com/sitemap.xml
- https://www.rawmaterialstrade.com/llms.txt
- https://www.rawmaterialstrade.com/ai-company-profile.json

## Google Search Console

Submit sitemap:

`https://www.rawmaterialstrade.com/sitemap.xml`

Use URL Inspection for:

- `https://www.rawmaterialstrade.com/`
- `https://www.rawmaterialstrade.com/en.html`
- `https://www.rawmaterialstrade.com/hu.html`
- `https://www.rawmaterialstrade.com/de-at.html`

## Google Business Profile

Website field:

`https://www.rawmaterialstrade.com/`
