import type { Type } from "../enums.js";
import type { AnyProtocolType, Protocol } from "./type.js";

// type InferTuple<$Tuple extends readonly unknown[]> = $Tuple extends readonly AnyProtocolType[]
//     ? $Tuple extends readonly [infer $Head, ...infer $Tail]
//         ? [Infer<$Head>, ...InferTuple<$Tail>]
//         : []
//     : [];
//
// type InferType<$Type> = $Type extends AnyProtocolType ? $Type["type"]: never;
//
// type InferObject<$Type extends Protocol.Object> = {
//     [$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
// };
//
// export type Infer<
//     $ProtocolType,
//     $Type extends Type = InferType<$ProtocolType>,
// > = $ProtocolType extends AnyProtocolType
//     ? $Type extends PrimitiveMapKey
//         ? Nullable<$Nullable, PrimitiveMap[$Type]>
//         : $ProtocolType extends Protocol.Object
//             ? Nullable<$Nullable, InferObject<$ProtocolType>>
//             : $ProtocolType extends Protocol.Array
//                 ? Nullable<$Nullable, Infer<$ProtocolType[Key.Value]>[]>
//                 : $ProtocolType extends Protocol.Enum
//                     ? Nullable<$Nullable, $ProtocolType[Key.Value][number]>
//                     : $ProtocolType extends Protocol.Tuple
//                         ? Nullable<$Nullable, InferTuple<$ProtocolType[Key.Value]>>
//                         : Nullable<$Nullable, unknown>
//     : never;

export type Infer<A, B = any, C = any> = any;
