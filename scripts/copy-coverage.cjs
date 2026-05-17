const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const coverageSource = path.join(root, 'apps/docs/coverage');
const coverageTarget = path.join(root, 'www/coverage');

if (!fs.existsSync(coverageSource)) {
  throw new Error(`Coverage source not found: ${coverageSource}`);
}

fs.rmSync(coverageTarget, { recursive: true, force: true });
fs.cpSync(coverageSource, coverageTarget, { recursive: true });
