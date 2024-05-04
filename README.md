![Protocol image](https://github.com/the-minimal/protocol/blob/main/docs/the-minimal-protocol.jpg?raw=true)

Minimal JSON-like binary schema-full protocol for JS/TS with BYO runtime data validations.

## Highlights

- Small (< 1 KB)
- Fast
- Runtime data validations
- Customizable memory
- 8 types
  - `boolean`
  - `int`
  - `float`
  - `string`
  - `object`
  - `array`
  - `enum`
  - `tuple`
- Support for nullable

## API

### `init`

This function sets up all underlying buffers and counters.

It has to be called before `encode` is called (not needed for `decode`).

```ts
init({
    DEFAULT_POOL_SIZE: 4_000,
    MAX_POOL_SIZE: 16_000,
    DEFAULT_CHUNK_SIZE: 2_000,
});
```

### `encode`

Encodes JS data into `ArrayBuffer` based on `Type`.

```ts
const arrayBuffer = encode({
    type: "object",
    value: [
        { key: "name", type: "string" },
        { key: "age", type: "int" } 
    ]
}, {
    name: "Yamiteru",
    age: 27
});
```

### `decode`

Decodes `ArrayBuffer` into JS data based on `Type`.

```ts
const data = decode({
    type: "object",
    value: [
        { key: "name", type: "string" },
        { key: "age", type: "int" } 
    ]
}, arrayBuffer);
```

## Memory

Internally we use a growable `ArrayBuffer` of initial size of 512 KB and maximum size of 5 MB which we segment into 8 KB chunks.

On every `encode` call we check if there is enough free chunks and if there is not then we attempt to grow the buffer.

After `encode` is done it frees the chunks it used, so they can be reused in subsequent calls.

Choose number of chunks based on your expected size of the data wisely since if the sub-buffer created from chunks is not big enough it will throw an overflow error.

## Types

### Boolean

```ts
{
   type: "boolean";
}
```

### Int

| size | signed | min         | max        | bytes |
|:-----|:-------|:------------|:-----------|:------|
| 8    | false  | 0           | 255        | 1     |
| 8    | true   | -127        | 128        | 1     |
| 16   | false  | 0           | 65535      | 2     |
| 16   | true   | -32768      | 32767      | 2     |
| 32   | false  | 0           | 65535      | 4     |
| 32   | true   | -2147483648 | 2147483647 | 4     |

```ts
{
   type: "int";
   size?: 8 | 16 | 32;  // default: 8
   signed?: boolean;  // default: false
}
```

### Float

| size | min                      | max                     | bytes |
|:-----|:-------------------------|:------------------------|:------|
| 32   | -3.402823e+38            | 3.402823e+38            | 4     |
| 64   | -1.7976931348623157e+308 | 1.7976931348623157e+308 | 8     |

```ts
{
   type: "float";
   size?: 32 | 64;  // default: 32 
}
```

### String

| size | string length (bytes) |
|:-----|:----------------------|
| 8    | 256                   |
| 16   | 65536                 |

```ts
{
   type: "string";
   kind?: "ascii" | "utf8" | "utf16";  // default: "ascii"
   size?: 8 | 16;  // default: 8
}
```

### Object

```ts
{
   type: "object";
   value: (Type.Any & Required<Type.Keyable>)[];
}
```

### Array

| size | array length (bytes) |
|:-----|:---------------------|
| 8    | 256                  |
| 16   | 65536                |

```ts
{
   type: "array";
   value: Type.Any;
   size?: 8 | 16;  // default: 8
}
```

### Tuple

```ts
{
   type: "array";
   value: Type.Any[];
}
```

### Enum

```ts
{
   type: "enum";
   value: unknown[];
}
```

## Keyable 

Used in `Object` for property names.

```ts
{
   key?: string;
}
```

## Nullable

Any type can be made nullable by adding `nullable` property to it.

```ts
{
   nullable?: boolean;
}
```

## Assert

Any type can be asserted by adding `assert` property to it.

In `encode` it's run before encoding and in `decode` it's run after decoding.

If type is `nullable` and the value is `null` we do not run `assert` in either `encode` or `decode`.

```ts
{
   assert?: (v: unknown) => asserts v is unknown;
}
```
