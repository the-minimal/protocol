# Highlights

- Small (~ 1.1 KB)
- Minimal runtime overhead
- Static type inference
- Single-pass data validation

# Example

```ts
import { email, rangeLength } from "@the-minimal/validator";
import { encodeObject, encodeAscii8, encodeUint8, encodeTap } from "@the-minimal/protocol";

const encodeUserData = encodeObject([
  {
    key: "email",
    type: encodeTap(
      encodeAscii8,
      email
    )
  },
  {
    key: "age",
    type: encodeTap(
      encodeUint8,
      rangeValue(0, 120)
    )
  },
]);

const array = new Uint8Array(128);
const view = new DataView(array.buffer);
const state = {
  a: array,
  v: view,
  o: 0
};

encodeUserLogin(state, {
  email: "user@example.com",
  age: 26
});

return array.subarray(0, state.o);
```

# State

Every encoder and decoder accepts `State` which looks like this:

```ts
type State = {
  // array
  a: Uint8Array;
  // view
  v: DataView;
  // offset
  o: number;
};
```

This library doesn't come with its own memory allocator.

It's up to you and your specific use-case what kind of memory allocator you use.

# Modularity

This library is basically just a tiny opinionated wrapper around `State`.

We use either `Uint8Array` or `DataView` to modify or read buffer and then we bump the offset.

All functions are standalone encoders and decoders which take `State` as a parameter.

This makes it very easy to extend the library to your liking and compose our encoders and decoders with your custom ones.

# API

## Bool

Encoded as `Uint8` with values `0` or `1`.

```ts
encodeBool(state, true);
decodeBool(state);
```

## Uint8

```ts
encodeUint8(state, 64);
decodeUint8(state);
```

## Uint16

```ts
encodeUint16(state, 1024);
decodeUint16(state);
```

## Uint32

```ts
encodeUint32(state, 128_000);
decodeUint32(state);
```

## Int8

```ts
encodeInt8(state, 64);
decodeInt8(state);
```

## Int16

```ts
encodeInt16(state, 1024);
decodeInt16(state);
```

## Int32

```ts
encodeInt32(state, 128_000);
decodeInt32(state);
```

## Float32

```ts
encodeFloat32(state, 3.16);
decodeFloat32(state);
```

## Float64

```ts
encodeFloat64(state, 420_000.69);
decodeFloat64(state);
```

## Ascii8

ASCII string of maximum length of 256 bytes (256 characters).

```ts
encodeAscii8(state, "Hello, World!");
decodeAscii8(state);
```

## Ascii16

ASCII string of maximum length of 65536 bytes (65536 characters).

```ts
encodeAscii16(state, "Lorem ipsum dolor sit amet, ..");
decodeAscii16(state);
```

## Unicode8

Unicode string of maximum length of 256 bytes (64-128 characters).

```ts
encodeUnicode8(state, "Dobré ráno, světe!");
decodeUnicode8(state);
```

## Unicode16

ASCII string of maximum length of 65536 bytes (16384-32768 characters).

```ts
encodeUnicode16(state, "Oprávněné aniž i odstoupil o snadno osoby ..");
decodeUnicode16(state);
```

## Array8

Array of maximum length of 256.

```ts
encodeArray8(encodeUint8)(state, [1, 16, 4, 8, 7]);
decodeArray8(encodeUint8)(state);
```

## Array16

Array of maximum length of 65536.

```ts
encodeArray16(encodeUint8)(state, [1, 16, 4, 8, 7, ..]);
decodeArray16(encodeUint8)(state);
```

## Object

All keys have to be defined, otherwise the buffer will be misaligned.

```ts
encodeObject([
  { key: "email", type: encodeAscii8 },
  { key: "password", type: encodeAscii8 },
])(state, {
  email: "yamiteru@icloud.com",
  password: "Test123456"
});

decodeObject([
  { key: "email", type: decodeAscii8 },
  { key: "password", type: decodeAscii8 },
])(state);
```

## Tuple

The maximum length of tuple is 256.

```ts
encodeTuple([
  encodeUint8,
  encodeUint8,
  encodeAscii
])(state, [185, 90, "yamiteru"]);

decodeTuple([
  decodeUint8,
  decodeUint8,
  decodeAscii
])(state);
```

## Enum

Maximum length of enum options is 256.
Options are represented as uint8 indexes.

```ts
encodeEnum(["ADMIN", "USER"])(state, "USER");
decodeEnum(["ADMIN", "USER"])(state);
```

## Nullable

Value in buffer is prefixed with uint8 `0` if value is not null or `1` if value is null.

```ts
encodeNullable(encodeUint8)(state, 2);
decodeNullable(decodeUint8)(state);
```

## Tap

This function is not encoded into buffer.

It's used for intercepting values.

Most notable use-case would be data validation while encoding or decoding.

The tap is executed before encoding and after decoding.

```ts
encodeTap(encodeUint8, () => { /* .. */ })(state, 2);
decodeTap(decodeUint8, () => { /* .. */ })(state);
```
