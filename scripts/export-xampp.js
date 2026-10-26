const { spawnSync } = require('node:child_process');

// La ruta coincide con la carpeta del proyecto dentro de htdocs.
const resultado = spawnSync(process.execPath, [require.resolve('expo/bin/cli'), 'export', '--platform', 'web'], {
  stdio: 'inherit',
  env: { ...process.env, RELAX_WEB_BASE_URL: '/RELAX-Mobile/dist' },
});
if (resultado.error) throw resultado.error;
process.exit(resultado.status ?? 1);
