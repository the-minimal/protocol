import type {TypeValue} from "../enums.js";
import type {PrimitiveMap, PrimitiveMapKey} from "./maps.js";
import type {AnyProtocolType, Protocol} from "./type.js";

type InferTuple<$Tuple extends readonly unknown[]> = $Tuple extends readonly AnyProtocolType[]
    ? $Tuple extends readonly [infer $Head, ...infer $Tail]
        ? [Infer<$Head>, ...InferTuple<$Tail>]
        : []
    : [];

type Nullable<$Boolean extends boolean, $Type> = $Boolean extends true
    ? $Type | null
    : $Type;

type InferType<$Type> = $Type extends AnyProtocolType ? $Type["type"]: never;

type InferNullable<$Type> = $Type extends Required<Protocol.Nullable >
    ? $Type["nullable"]
    : false;

type InferObject<$Type extends Protocol.Object> = {
    [$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
};

export type Infer<
    $ProtocolType,
    $Type extends TypeValue = InferType<$ProtocolType>,
    $Nullable extends boolean = InferNullable<$ProtocolType>
> = $ProtocolType extends AnyProtocolType
    ? $Type extends PrimitiveMapKey
        ? Nullable<$Nullable, PrimitiveMap[$Type]>
        : $ProtocolType extends Protocol.Object
            ? Nullable<$Nullable, InferObject<$ProtocolType>>
            : $ProtocolType extends Protocol.Array
                ? Nullable<$Nullable, Infer<$ProtocolType["value"]>[]>
                : $ProtocolType extends Protocol.Enum
                    ? Nullable<$Nullable, $ProtocolType["value"][number]>
                    : $ProtocolType extends Protocol.Tuple
                        ? Nullable<$Nullable, InferTuple<$ProtocolType["value"]>>
                        : Nullable<$Nullable, unknown>
    : never;
