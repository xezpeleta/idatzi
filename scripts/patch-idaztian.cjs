/**
 * Postinstall script: patches the flat-package monorepo structure
 * of idaztian when installed via file: dependency, so its package.json
 * exports point to the dist/ files correctly.
 *
 * This is needed because npm's `file:` protocol creates a symlink
 * to the source directory, not to the built dist. In CI, the library
 * is already built before this script runs.
 */

const fs = require('fs');
const path = require('path');

const IDAZTIAN_ROOT = path.resolve(__dirname, '..', 'node_modules', 'idaztian');

// Check if the package is already in a good state (has dist/ with built files)
const distFile = path.join(IDAZTIAN_ROOT, 'dist', 'idaztian.js');
if (fs.existsSync(distFile)) {
  console.log('[postinstall] idaztian dist/ already exists, skipping patch');
  process.exit(0);
}

// Try to read and patch the package.json
const pkgPath = path.join(IDAZTIAN_ROOT, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.warn('[postinstall] idaztian package.json not found at', pkgPath);
  console.warn('[postinstall] skipping patch — you may need to build idaztian first');
  process.exit(0);
}

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.main = './dist/idaztian.umd.cjs';
  pkg.module = './dist/idaztian.js';
  pkg.exports = {
    '.': {
      import: './dist/idaztian.js',
      require: './dist/idaztian.umd.cjs',
      types: './dist/index.d.ts',
    },
    './style.css': './dist/idaztian.css',
  };
  pkg.types = './dist/index.d.ts';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('[postinstall] patched idaztian package.json to point to dist/');
} catch (e) {
  console.warn('[postinstall] failed to patch idaztian:', e.message);
  console.warn('[postinstall] skipping — you may need to build idaztian first');
  process.exit(0);
}
