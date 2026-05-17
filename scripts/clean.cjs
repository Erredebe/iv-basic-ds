const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const paths = [
  'www',
  'playwright-report',
  'test-results',
  'apps/docs/www',
  'apps/docs/dist',
  'apps/docs/loader',
  'apps/docs/test-results',
  'apps/docs/playwright-report',
  'packages/atoms/iv-button/www',
  'packages/atoms/iv-button/dist',
  'packages/atoms/iv-button/loader',
  'packages/atoms/iv-icon/www',
  'packages/atoms/iv-icon/dist',
  'packages/atoms/iv-icon/loader',
  'packages/atoms/iv-input/www',
  'packages/atoms/iv-input/dist',
  'packages/atoms/iv-input/loader',
  'packages/atoms/iv-textarea/www',
  'packages/atoms/iv-textarea/dist',
  'packages/atoms/iv-textarea/loader',
  'packages/molecules/iv-dialog/www',
  'packages/molecules/iv-dialog/dist',
  'packages/molecules/iv-dialog/loader',
];

for (const entry of paths) {
  fs.rmSync(path.join(root, entry), { recursive: true, force: true });
}
