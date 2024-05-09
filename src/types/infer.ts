import type {NameValue} from "../enums.js";
import {AnyType, Type} from "./type.js";
import {PrimitiveMap, PrimitiveMapKey} from "./maps.js";

type InferTuple<$Tuple extends readonly unknown[]> = $Tuple extends readonly AnyType[]
    ? $Tuple extends readonly [infer $Head, ...infer $Tail]
        ? [Infer<$Head>, ...InferTuple<$Tail>]
        : []
    : [];

type Nullable<$Boolean extends boolean, $Type> = $Boolean extends true
    ? $Type | null
    : $Type;

type InferName<$Type> = $Type extends AnyType ? $Type["name"]: never;

type InferNullable<$Type> = $Type extends Required<Type.Nullable >
    ? $Type["nullable"]
    : false;

type InferObject<$Type extends Type.Object> = {
    [$Prop in $Type["value"][number] as $Prop["key"]]: Infer<$Prop>;
};

export type Infer<
    $Type,
    $Name extends NameValue = InferName<$Type>,
    $Nullable extends boolean = InferNullable<$Type>
> = $Type extends AnyType
    ? $Name extends PrimitiveMapKey
        ? Nullable<$Nullable, PrimitiveMap[$Name]>
        : $Type extends Type.Object
            ? Nullable<$Nullable, InferObject<$Type>>
            : $Type extends Type.Array
                ? Nullable<$Nullable, Infer<$Type["value"]>[]>
                : $Type extends Type.Enum
                    ? Nullable<$Nullable, $Type["value"][number]>
                    : $Type extends Type.Tuple
                        ? Nullable<$Nullable, InferTuple<$Type["value"]>>
                        : Nullable<$Nullable, unknown>
    : never;
