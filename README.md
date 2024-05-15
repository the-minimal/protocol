![Protocol image](https://github.com/the-minimal/protocol/blob/main/docs/the-minimal-protocol.jpg?raw=true)

Minimal JSON-like binary schema-full protocol for JS/TS with BYO runtime data validations.

## Highlights

- Small (< 1.5 KB)
- Fast
- Runtime data validations
- 36 types
  - `Boolean`
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
  - `Object`
  - `Array8`
  - `Array16`
  - `Enum`
  - `Tuple`
  - `NullableBoolean`
  - `NullableUInt8`
  - `NullableUInt16`
  - `NullableUInt32`
  - `NullableInt8`
  - `NullableInt16`
  - `NullableInt32`
  - `NullableFloat32`
  - `NullableFloat64`
  - `NullableAscii8`
  - `NullableAscii16`
  - `NullableUnicode8`
  - `NullableUnicode16`
  - `NullableObject`
  - `NullableArray8`
  - `NullableArray16`
  - `NullableEnum`
  - `NullableTuple`
- Estimate payload size
- Static type inference

## API

### `encode`

Encodes JS data into `ArrayBuffer` based on `Type`.

```ts
const arrayBuffer = encode({
    type: Type.Object,
    value: [
        { key: "name", type: Type.Ascii },
        { key: "age", type: Type.UInt8 } 
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
        { key: "name", type: Type.Ascii },
        { key: "age", type: Type.UInt8 } 
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
        { key: "name", type: Type.Ascii, maxLength: 64 },
        { key: "age", type: Type.UInt8 } 
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
        { key: "name", type: Type.Ascii },
        { key: "age", type: Type.UInt8 } 
    ]
} as const;

// {
//     type: string,
//     age: number
// }
type User = Infer<typeof user>;
```

## Types

### Boolean

```ts
{
    type: 
        | Type.Boolean 
        | Type.NullableBoolean;
}
```

### UInt

```ts
{
    type: 
        | Type.UInt8
		| Type.UInt16
		| Type.UInt32
		| Type.NullableUInt8
		| Type.NullableUInt16
		| Type.NullableUInt32;
}
```

### Int

```ts
{
    type: 
        | Type.Int8
		| Type.Int16
		| Type.Int32
		| Type.NullableInt8
		| Type.NullableInt16
		| Type.NullableInt32;
}
```

### Float


```ts
{
    type: 
        | Type.Float32
        | Type.Float64
        | Type.NullableFloat32
        | Type.NullableFloat64;
}
```

### Ascii

```ts
{
    type: 
        | Type.Ascii8
        | Type.Ascii16
        | Type.NullableAscii8
        | Type.NullableAscii16;
}
```

### Unicode

```ts
{
    type: 
        | Type.Unicode8
        | Type.Unicode16
        | Type.NullableUnicode8
        | Type.NullableUnicode16;
}
```

### Object

```ts
{
    type: 
        | Type.Object
        | Type.NullableObject;
    value: (AnyType & Required<Type.Keyable>)[];
}
```

### Array

```ts
{
    type: 
        | Type.Array8
        | Type.Array16
        | Type.NullableArray8
        | Type.NullableArray16;
    value: AnyType;
}
```

### Tuple

```ts
{
    type: 
        | Type.Tuple
        | Type.NullableTuple;
    value: AnyType[];
}
```

### Enum

```ts
{
    type: 
        | Type.Enum
        | Type.NullableEnum;
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

If type is `nullable` and the value is `null` we do not run `assert` in either `encode` or `decode`.

```ts
{
   assert?: (v: unknown) => asserts v is unknown;
}
```
