const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');
const buildInfoPath = path.join(distDir, 'build-info.json');
const pkg = require('../package.json');

// The build script executes its work at require-time (top-level side effects).
// We reset the module registry between runs so we can re-invoke the script.
function runBuild() {
  jest.resetModules();
  require('./build.js');
}

describe('scripts/build.js', () => {
  let logSpy;
  let originalSha;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    originalSha = process.env.GITHUB_SHA;
  });

  afterEach(() => {
    logSpy.mockRestore();
    if (originalSha === undefined) {
      delete process.env.GITHUB_SHA;
    } else {
      process.env.GITHUB_SHA = originalSha;
    }
  });

  afterAll(() => {
    // Clean up generated dist directory so we don't leave artefacts behind.
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  test('creates the dist directory', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    expect(fs.existsSync(distDir)).toBe(true);
    expect(fs.statSync(distDir).isDirectory()).toBe(true);
  });

  test('copies every file from src into dist', () => {
    delete process.env.GITHUB_SHA;
    runBuild();

    const srcFiles = fs.readdirSync(srcDir);
    for (const file of srcFiles) {
      const copied = path.join(distDir, file);
      expect(fs.existsSync(copied)).toBe(true);
      expect(fs.readFileSync(copied, 'utf8')).toBe(
        fs.readFileSync(path.join(srcDir, file), 'utf8')
      );
    }
  });

  test('writes a build-info.json file', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    expect(fs.existsSync(buildInfoPath)).toBe(true);
  });

  test('build-info.json contains name and version from package.json', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    const info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    expect(info.name).toBe(pkg.name);
    expect(info.version).toBe(pkg.version);
  });

  test('build-info.json builtAt is a valid ISO timestamp', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    const info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    expect(typeof info.builtAt).toBe('string');
    const parsed = new Date(info.builtAt);
    expect(Number.isNaN(parsed.getTime())).toBe(false);
    // ISO string round-trips
    expect(parsed.toISOString()).toBe(info.builtAt);
  });

  test('commit defaults to "local" when GITHUB_SHA is not set', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    const info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    expect(info.commit).toBe('local');
  });

  test('commit uses GITHUB_SHA when set', () => {
    process.env.GITHUB_SHA = 'abc123def456';
    runBuild();
    const info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    expect(info.commit).toBe('abc123def456');
  });

  test('build-info.json is pretty-printed with 2-space indentation', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    const raw = fs.readFileSync(buildInfoPath, 'utf8');
    expect(raw).toContain('\n  "name":');
    // Re-serializing the parsed object with the same options reproduces the file.
    const info = JSON.parse(raw);
    expect(JSON.stringify(info, null, 2)).toBe(raw);
  });

  test('logs a message pointing to the dist directory', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    expect(logSpy).toHaveBeenCalledWith(`Artefato gerado em ${distDir}`);
  });

  test('re-running the build cleans and regenerates dist (idempotent)', () => {
    delete process.env.GITHUB_SHA;
    runBuild();

    // Drop a stale file into dist that is not present in src.
    const staleFile = path.join(distDir, '__stale_should_be_removed__.txt');
    fs.writeFileSync(staleFile, 'stale');
    expect(fs.existsSync(staleFile)).toBe(true);

    runBuild();

    // The dist dir was removed and recreated, so the stale file must be gone
    // (unless src happens to contain a file of the same name, which it does not).
    expect(fs.existsSync(staleFile)).toBe(false);
    expect(fs.existsSync(buildInfoPath)).toBe(true);
  });

  test('build-info.json only contains the four expected keys', () => {
    delete process.env.GITHUB_SHA;
    runBuild();
    const info = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    expect(Object.keys(info).sort()).toEqual(
      ['builtAt', 'commit', 'name', 'version'].sort()
    );
  });
});
