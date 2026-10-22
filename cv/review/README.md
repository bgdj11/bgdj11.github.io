# Bogdan Dukic — CV

One-page CV for computer vision, computer graphics, machine learning and AI engineering roles.

- Editable source: `Bogdan_Dukic_CV.tex`.
- Rebuilt PDF: `Bogdan_Dukic_CV.pdf`.
- Identical website copy: `pixel-worlds/public/Bogdan_Dukic_CV.pdf`.

The PDF has one A4 page, selectable text and clickable links. It uses Lato with black text, headings and rules. The header displays the French phone number and readable portfolio, GitHub and LinkedIn addresses.

To edit and rebuild, use XeLaTeX with the Lato TrueType fonts available through TeX Live or locally. Tectonic can also compile this source using its bundled Lato fonts:

```text
xelatex Bogdan_Dukic_CV.tex
```

After future edits, copy the rebuilt PDF to the website location above. All CV previews and downloads share this file through `profile.resume` in `pixel-worlds/src/data/portfolio.ts`.

GitHub Pages publishes the website after commit and push through the repository's existing deployment workflow.
