# Header/mobile hardfix v2 — 2026-05-26

- Critical header CSS is now inlined into every HTML file, so browser cache or a missed CSS upload cannot break the fixed header.
- The same rules remain in `rmt-header-mobile-fix.css` as external fallback.
- Runtime guard script forces the header to stay fixed and visible on scroll/resize/orientation change.
- Mobile order enforced: logo left, languages right, hamburger far right.
- Thin divider between language switcher and hamburger.
- Product catalogue categories remain closed on initial load and while searching; only explicit category/filter click opens a category.
- Hero logo remains larger and frameless.
