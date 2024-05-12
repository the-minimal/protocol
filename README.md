![Protocol image](https://github.com/the-minimal/protocol/blob/main/docs/the-minimal-protocol.jpg?raw=true)

Minimal JSON-like binary schema-full protocol for JS/TS with BYO runtime data validations.

## Highlights

- Small (< 1.5 KB)
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
- Estimate payload size
- Static type inference

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
    type: Type.Object,
    value: [
        { key: "name", type: Type.String },
        { key: "age", type: Type.Int } 
    ]
}, {
    type: "Yamiteru",
    age: 27
});
```

### `decode`

Decodes `ArrayBuffer` into JS data based on `Type`.

```ts
const data = decode({
    type: Type.Object,
    value: [
        { key: "name", type: Type.String },
        { key: "age", type: Type.Int } 
    ]
}, arrayBuffer);
```

### `estimate`

Estimates payload size of `Type` in bytes and chunks based on provided `Settings`.

```ts
const { 
  bytes,  // 66 
  chunks  // 9
} = estimate({
  type: Type.Object,
  value: [
    { key: "email", type: Type.String, maxLength: 64 },
    { key: "age", type: Type.Int } 
  ]
}, {
  MAX_POOL_SIZE: 256,
  DEFAULT_POOL_SIZE: 16,
  DEFAULT_CHUNK_SIZE: 8,
});
```

### `Infer`

Once you create a `Type` you can easily infer it with `Infer`.

`encode` uses `Infer` for its input value and `decode` for its output value.

```ts
const user = {
    type: Type.Object,
    value: [
        { key: "name", type: Type.String },
        { key: "age", type: Type.Int } 
    ]
} as const;

// {
//     type: string,
//     age: number
// }
type User = Infer<typeof user>;
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
   type: Type.Boolean;
}
```

### Int

| size | signed | min         | max        | bytes |
|:-----|:-------|:------------|:-----------|:------|
| 1    | false  | 0           | 255        | 1     |
| 1    | true   | -127        | 128        | 1     |
| 2    | false  | 0           | 65535      | 2     |
| 2    | true   | -32768      | 32767      | 2     |
| 4    | false  | 0           | 65535      | 4     |
| 4    | true   | -2147483648 | 2147483647 | 4     |

```ts
{
   type: Type.Int;
   size?: 1 | 2 | 4;  // default: 1
   signed?: boolean;  // default: false
}
```

### Float

| size | min                      | max                     | bytes |
|:-----|:-------------------------|:------------------------|:------|
| 4   | -3.402823e+38            | 3.402823e+38            | 4     |
| 8   | -1.7976931348623157e+308 | 1.7976931348623157e+308 | 8     |

```ts
{
   type: Type.Float;
   size?: 4 | 8;  // default: 4
}
```

### String

| size | max length (bytes) |
|:-----|:-------------------|
| 1    | 256                |
| 2    | 65536              |

```ts
{
   type: Type.String;
   kind?: Kind.Ascii | Kind.Utf8;  // default: Kind.Ascii 
   size?: 1 | 2;  // default: 1
}
```

### Object

```ts
{
   type: Type.Object;
   value: (AnyType & Required<Type.Keyable>)[];
}
```

### Array

| size | max length (bytes) |
|:-----|:-------------------|
| 1    | 256                |
| 2    | 65536              |

```ts
{
   type: Type.Array;
   value: AnyType;
   size?: 1 | 2;  // default: 1
}
```

### Tuple

```ts
{
   type: Type.Tuple;
   value: AnyType[];
}
```

### Enum

```ts
{
   type: Type.Enum;
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
