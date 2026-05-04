const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const docsWww = path.join(root, 'apps/docs/www');
const rootWww = path.join(root, 'www');
const versionFixtures = path.join(root, 'version-fixtures/components');
const packages = [
  { atomicLevel: 'atoms', name: 'iv-button' },
  { atomicLevel: 'atoms', name: 'iv-icon' },
  { atomicLevel: 'atoms', name: 'iv-input' },
  { atomicLevel: 'atoms', name: 'iv-textarea' },
  { atomicLevel: 'molecules', name: 'iv-dialog' },
];

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
}

function copyDirectory(source, target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

run('npm', ['run', 'clean']);
run('npm', ['run', 'build:netlify', '--workspace', '@iv-basic-ds/docs']);
copyDirectory(docsWww, rootWww);

if (fs.existsSync(versionFixtures)) {
  fs.cpSync(versionFixtures, path.join(rootWww, 'components'), { recursive: true });
}

for (const { atomicLevel, name: packageName } of packages) {
  const workspaceName = `@iv-basic-ds/${packageName}`;
  run('npm', ['run', 'build', '--workspace', workspaceName]);

  const packageRoot = path.join(root, 'packages', atomicLevel, packageName);
  const packageJson = require(path.join(packageRoot, 'package.json'));
  const source = path.join(packageRoot, 'www/build');
  const target = path.join(rootWww, 'components', packageName, packageJson.version, 'build');

  copyDirectory(source, target);
}
