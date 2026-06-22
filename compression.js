import fs from 'fs';
import zlib from 'zlib';
import glob from 'glob';

const precompress = async () => {
  const files = await glob('dist/**/*.{js,css,svg,ttf}');
  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    try {
      const data = fs.readFileSync(file);
      fs.writeFileSync(
        `${file}.br`,
        zlib.brotliCompressSync(data, {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
        }),
      );

      fs.writeFileSync(
        `${file}.gz`,
        zlib.gzipSync(data, {
          level: 9,
        }),
      );
    } catch (e) {
      console.warn(`Could not compress ${file}:`, e.message);
    }
  });
};

precompress();
