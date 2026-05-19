const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}

const pkg = require('../package.json');
fs.writeFileSync(
  path.join(distDir, 'build-info.json'),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      builtAt: new Date().toISOString(),
      commit: process.env.GITHUB_SHA || 'local'
    },
    null,
    2
  )
);

console.log(`Artefato gerado em ${distDir}`);
