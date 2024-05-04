# protocol

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
   properties: (Type.Any & Required<Type.Keyable>)[];
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
   item: Type.Any;
   size?: 8 | 16;  // default: 8
}
```

### Tuple

```ts
{
   type: "array";
   items: Type.Any[];
}
```

### Enum

```ts
{
   type: "enum";
   items: unknown[];
}
```

## Keyable 

```ts
{
   key?: string;
}
```

## Nullable

```ts
{
   nullable?: boolean;
}
```

## Assert

```ts
{
   assert?: (v: unknown) => asserts v is unknown;
}
```
