const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const result = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports: result.exports, module: result, require: (asset) => ({ uri: '/RELAX-Mobile/' + path.posix.normalize('src/data/' + asset) }) }, { filename: file });
  return result.exports;
}
const { HOSPEDAJES } = load('src/data/hospedajes.ts');
const { ZONAS } = load('src/data/zonas.ts');
fs.writeFileSync('database/seed.local.json', JSON.stringify({ hospedajes: HOSPEDAJES, zonas: ZONAS }, null, 2));
console.log(`Catálogos preparados: ${HOSPEDAJES.length} hospedajes, ${ZONAS.length} zonas.`);
