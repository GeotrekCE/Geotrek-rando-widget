const fs = require('fs');
const zlib = require('zlib');
const glob = require('glob');

const precompress = async () => {
  const files = await glob('dist/**/*.{js,css,svg}');
  files.forEach(file => {
    fs.writeFileSync(
      `${file}.br`,
      zlib.brotliCompressSync(file, {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      }),
    );

    fs.writeFileSync(
      `${file}.gz`,
      zlib.gzipSync(file, {
        level: 9,
      }),
    );
  });
};

precompress();
