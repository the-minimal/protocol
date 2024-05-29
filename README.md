![Protocol image](https://github.com/the-minimal/protocol/blob/main/docs/the-minimal-protocol.jpg?raw=true)

Minimal and modular binary schema-full protocol for TypeScript.

# Highlights

- Small (< 1.1 KB)
- Minimal runtime overhead
- Static type inference
- BYO runtime data validation

# Example

```ts
import { email, rangeLength } from "@the-minimal/validator";
import { EncodeObject, EncodeTap, EncodeAscii8 } from "@the-minimal/protocol";

const EncodeUserLogin = EncodeObject([
  {
    key: "email",
    type: EncodeTap(
      EncodeAscii8,
      email
    )
  },
  {
    key: "password",
    type: EncodeTap(
      EncodeAscii8,
      rangeLength(8, 16)
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

EncodeUserLogin(state, {
  email: "user@example.com",
  password: "mysecretpassword"
});

return array.subarray(0, state.o);
```
