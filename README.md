![Protocol image](https://github.com/the-minimal/protocol/blob/main/docs/the-minimal-protocol.jpg?raw=true)

Minimal JSON-like binary schema-full protocol for JS/TS with BYO runtime data validations.

## Highlights

- Small (< 1.5 KB)
- Minimal runtime overhead
- Runtime data validations
- 36 types
  - `Bool`
  - `UInt8`
  - `UInt16`
  - `UInt32`
  - `Int8`
  - `Int16`
  - `Int32`
  - `Float32`
  - `Float64`
  - `Ascii8`
  - `Ascii16`
  - `Unicode8`
  - `Unicode16`
  - `Struct`
  - `Array8`
  - `Array16`
  - `Enum`
  - `Tuple`
  - `NBool`
  - `NUInt8`
  - `NUInt16`
  - `NUInt32`
  - `NInt8`
  - `NInt16`
  - `NInt32`
  - `NFloat32`
  - `NFloat64`
  - `NAscii8`
  - `NAscii16`
  - `NUnicode8`
  - `NUnicode16`
  - `NStruct`
  - `NArray8`
  - `NArray16`
  - `NEnum`
  - `NTuple`
- Estimate payload size
- Static type inference

## API

### `encode`

Encodes JS data into `ArrayBuffer` based on `Type`.

```ts
const arrayBuffer = encode({
    type: Struct,
    value: [
        { key: "name", type: Ascii8 },
        { key: "age", type: UInt8 }
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
    type: Struct,
    value: [
        { key: "name", type: Ascii8 },
        { key: "age", type: UInt8 }
    ]
}, arrayBuffer);
```

### `estimate`

Estimates payload size of `Type` in bytes and chunks.

```ts
const {
  bytes,  // 66
  chunks  // 1
} = estimate({
    type: Struct,
    value: [
        { key: "name", type: Ascii8, maxLength: 64 },
        { key: "age", type: UInt8 }
    ]
});
```

### `Infer`

Once you create a `Type` you can easily infer it with `Infer`.

`encode` uses `Infer` for its input value and `decode` for its output value.

```ts
const user = {
    type: Struct,
    value: [
        { key: "name", type: Ascii8 },
        { key: "age", type: UInt8 }
    ]
} as const;

// {
//     name: string,
//     age: number
// }
type User = Infer<typeof user>;
```

## Types

All nullable types have `N` prefix.

### Bool

```ts
{
    type:
        | Type.Bool
        | Type.NBool;
}
```

### UInt

```ts
{
    type:
      | Type.UInt8
      | Type.UInt16
      | Type.UInt32
      | Type.NUInt8
      | Type.NUInt16
      | Type.NUInt32;
}
```

### Int

```ts
{
    type:
      | Type.Int8
      | Type.Int16
      | Type.Int32
      | Type.NInt8
      | Type.NInt16
      | Type.NInt32;
}
```

### Float


```ts
{
    type:
        | Type.Float32
        | Type.Float64
        | Type.NFloat32
        | Type.NFloat64;
}
```

### Ascii

```ts
{
    type:
        | Type.Ascii8
        | Type.Ascii16
        | Type.NAscii8
        | Type.NAscii16;
}
```

### Unicode

```ts
{
    type:
        | Type.Unicode8
        | Type.Unicode16
        | Type.NUnicode8
        | Type.NUnicode16;
}
```

### Struct

```ts
{
    type:
        | Type.Struct
        | Type.NStruct;
    value: (AnyType & Required<Type.Keyable>)[];
}
```

### Array

```ts
{
    type:
        | Type.Array8
        | Type.Array16
        | Type.NArray8
        | Type.NArray16;
    value: AnyType;
}
```

### Tuple

```ts
{
    type:
        | Type.Tuple
        | Type.NTuple;
    value: AnyType[];
}
```

### Enum

```ts
{
    type:
        | Type.Enum
        | Type.NEnum;
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

## Assert

Any type can be asserted by adding `assert` property to it.

In `encode` it's run before encoding and in `decode` it's run after decoding.

If type is nullable and the value is `null` we don't run `assert` in either `encode` or `decode`.

```ts
{
   assert?: (v: unknown) => undefined | unknown;
}
```
