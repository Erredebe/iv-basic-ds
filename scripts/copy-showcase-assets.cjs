const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const showcaseRoot = path.join(root, 'apps/showcase');
const showcaseDist = path.join(showcaseRoot, 'dist/showcase');
const showcaseBrowserDist = path.join(showcaseDist, 'browser');
const distRoot = fs.existsSync(showcaseBrowserDist) ? showcaseBrowserDist : showcaseDist;

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing showcase asset source: ${source}`);
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

copyDirectory(path.join(root, 'apps/docs/www/build'), path.join(distRoot, 'assets/iv-basic-ds/build'));
copyDirectory(path.join(showcaseRoot, 'src/history'), path.join(distRoot, 'history'));
