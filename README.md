# Bogdan Djukic — portfolio

The deployable React + TypeScript + Vite application is self-contained in `pixel-worlds/`.

```sh
cd pixel-worlds
npm ci
npm run dev
```

Use Node.js 22.12+ (GitHub Actions uses Node.js 24). `npm run build` checks TypeScript and creates `pixel-worlds/dist/`.

## GitHub Pages

1. In the repository, select **Settings → Pages → Source → GitHub Actions**.
2. Commit and push the changes to `v2` or `main`.
3. The [Pages workflow](.github/workflows/deploy-pages.yml) installs the locked dependencies, builds the app, and deploys `pixel-worlds/dist/`. You can also run it manually from Actions.

For the `bgdj11/bgdj11.github.io` repository the address is **https://bgdj11.github.io/**. The build uses the base path reported by GitHub Pages, including when a custom domain is configured. Do not upload the source `index.html` directly or select branch-based publishing: Vite needs its build step.

## Structure

- `pixel-worlds/src/`: components, styles, content, and bundled assets.
- `pixel-worlds/public/`: CV, project media, desktop icons, and other static files.
- `.github/workflows/deploy-pages.yml`: build and deployment.
- Root image/icon/cursor packs: original design assets; not required to build or deployed.
- `.tools/`, `.qa/`, `node_modules/`, and `dist/`: local or generated files, ignored by Git.

All CV entry points share `src/components/Resume.tsx` and open `ResumeDialog.tsx`, with a PDF viewer and download action. Replace `pixel-worlds/public/Bogdan_Dukic_CV.pdf` to update the CV. Further content documentation is in [pixel-worlds/README.md](pixel-worlds/README.md).
