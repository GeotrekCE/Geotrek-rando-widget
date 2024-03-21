import fs from 'fs';
import zlib from 'zlib';
import glob from 'glob';

const precompress = async () => {
  const files = await glob('dist/**/*.{js,css,svg,ttf}');
  files.forEach(file => {
    fs.writeFileSync(
      `${file}.br`,
      zlib.brotliCompressSync(fs.readFileSync(file), {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
      }),
    );

    fs.writeFileSync(
      `${file}.gz`,
      zlib.gzipSync(fs.readFileSync(file), {
        level: 9,
      }),
    );
  });
};

precompress();
