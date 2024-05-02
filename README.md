# protocol

## Types

### Boolean

```ts
{
   type: "boolean";
}
```

### Int

```ts
{
   type: "int";
   size?: 8 | 16 | 32;  // default: 8
   signed?: boolean;  // default: false
}
```

### Float

```ts
{
   type: "float";
   size?: 32 | 64;  // default: 32 
}
```

### String

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
   item: TypeWithKey[];
   size?: 8 | 16;  // default: 8
}
```

### Array

```ts
{
   type: "array";
   item: Type | TypeName;
   size?: 8 | 16;  // default: 8
}
```

### Tuple

```ts
{
   type: "array";
   items: (Type | TypeName)[];
}
```

### Enum

```ts
{
   type: "enum";
   items: string[];
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
