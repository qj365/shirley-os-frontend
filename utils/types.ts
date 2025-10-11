/** Get extracted type from an Array Type */
export type Unpacked<T> = T extends (infer U)[] ? U : T;

// eslint-disable-next-line
export type ObjectType = Record<string, any>;

/** Get type that would ensure such member will be added using Strictly Union */
type UnionKeys<T> = T extends T ? keyof T : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, undefined>>
  : never;
export type StrictUnion<T> = StrictUnionHelper<T, T>;
