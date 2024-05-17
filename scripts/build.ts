import { minify } from "terser";

const SRC= "./src";
const DIST = "./dist";
const FILES = [
  "encode.js",
  "decode.js",
  "estimate.js",
  "types.js",
];

(async () => {
  for (const name of FILES) {
    const file = Bun.file(`${SRC}/${name}`);
    const code = await file.text();
    const result = await minify(code, {
      compress: {
        defaults: true,
        module: true,
        passes: 5
      },
      mangle: {
        reserved: [
          "Bool",
          "NBool",
          "UInt8",
          "UInt16",
          "UInt32",
          "NUInt8",
          "NUInt16",
          "NUInt32",
          "Int8",
          "Int16",
          "Int32",
          "NInt8",
          "NInt16",
          "NInt32",
          "Float32",
          "Float64",
          "NFloat32",
          "NFloat64",
          "Ascii8",
          "Ascii16",
          "NAscii8",
          "NAscii16",
          "Unicode8",
          "Unicode16",
          "NUnicode8",
          "NUnicode16",
          "Struct",
          "NStruct",
          "Array8",
          "Array16",
          "NArray8",
          "NArray16",
          "Enum",
          "NEnum",
          "Tuple",
          "NTuple",
          "encode",
          "decode",
          "estimate"
        ],
        module: true,
      },
      parse: {
        html5_comments: false,
        shebang: false
      },
      ecma: 2020,
      module: true,
      sourceMap: true
    });

    await Bun.write(`${DIST}/${name}`, result.code!);
  }
})();

